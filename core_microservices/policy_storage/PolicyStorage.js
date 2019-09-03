const Web3 = require('web3');
const uuidV4 = require('uuid/v4');
const sha256 = require('js-sha256');
const _ = require('lodash');
const models = require('./models/module');
const errorMessages = require('./errorMessages');

/**
 * Generate random id
 * @return {String}
 */
const randomId = () => uuidV4().replace(/-/g, '');

/**
 * Dip Policy Storage
 */
class PolicyStorage {
  /**
   * Constructor
   * @param {Amqp} amqp
   */
  constructor({ amqp, db, log }) {
    this._amqp = amqp;
    this._log = log;

    this._models = models(db);
  }

  /**
   * Start application
   * @return {Promise<void>}
   */
  async bootstrap() {
    this._web3 = new Web3(new Web3.providers.HttpProvider(process.env.HTTP_PROVIDER || 'http://localhost:8545'));

    await this._amqp.consume({
      messageType: 'policyCreationRequest',
      messageVersion: '1.*',
      handler: this.onPolicyCreateMessage.bind(this),
    });
    await this._amqp.consume({
      messageType: 'initializePaymentResult',
      messageVersion: '1.*',
      handler: this.onInitializePaymentResult.bind(this),
    });
    await this._amqp.consume({
      messageType: 'policyGetRequest',
      messageVersion: '1.*',
      handler: this.onPolicyGetMessage.bind(this),
    });
    await this._amqp.consume({
      messageType: 'decodedEvent',
      messageVersion: '1.*',
      handler: this.handleDecodedEvent.bind(this),
    });
    await this._amqp.consume({
      messageType: 'applyForPolicySuccess',
      messageVersion: '1.*',
      handler: this.handleApplyForPolicySuccess.bind(this),
    });
    await this._amqp.consume({
      messageType: 'applyForPolicyError',
      messageVersion: '1.*',
      handler: this.handleApplyForPolicyError.bind(this),
    });
    await this._amqp.consume({
      messageType: 'createCustomer',
      messageVersion: '1.*',
      handler: this.handleCreateCustomer.bind(this),
    });
    await this._amqp.consume({
      messageType: 'getCustomer',
      messageVersion: '1.*',
      handler: this.handleGetEntity('Customer').bind(this),
    });
    await this._amqp.consume({
      messageType: 'listCustomers',
      messageVersion: '1.*',
      handler: this.handleList('Customers').bind(this),
    });
    await this._amqp.consume({
      messageType: 'contractDeployment',
      messageTypeVersion: '1.*',
      handler: this.saveArtifact.bind(this),
    });
    await this._amqp.consume({
      messageType: 'getArtifact',
      messageTypeVersion: '1.*',
      handler: this.handleGetArtifact.bind(this),
    });
    await this._amqp.consume({
      messageType: 'createMetadata',
      messageVersion: '1.*',
      handler: this.handleCreateMetadata.bind(this),
    });
    await this._amqp.consume({
      messageType: 'getMetadata',
      messageVersion: '1.*',
      handler: this.handleGetEntity('Metadata').bind(this),
    });
    await this._amqp.consume({
      messageType: 'listMetadata',
      messageVersion: '1.*',
      handler: this.handleList('Metadata').bind(this),
    });
    await this._amqp.consume({
      messageType: 'getApplication',
      messageVersion: '1.*',
      handler: this.handleGetEntity('Application').bind(this),
    });
    await this._amqp.consume({
      messageType: 'listApplications',
      messageVersion: '1.*',
      handler: this.handleList('Applications').bind(this),
    });
    await this._amqp.consume({
      messageType: 'getPolicy',
      messageVersion: '1.*',
      handler: this.handleGetEntity('Policy').bind(this),
    });
    await this._amqp.consume({
      messageType: 'listPolicies',
      messageVersion: '1.*',
      handler: this.handleList('Policies').bind(this),
    });

    await this._amqp.consume({
      messageType: 'getClaim',
      messageVersion: '1.*',
      handler: this.handleGetEntity('Claim').bind(this),
    });
    await this._amqp.consume({
      messageType: 'listClaims',
      messageVersion: '1.*',
      handler: this.handleList('Claims').bind(this),
    });

    await this._amqp.consume({
      messageType: 'getPayout',
      messageVersion: '1.*',
      handler: this.handleGetEntity('Payout').bind(this),
    });
    await this._amqp.consume({
      messageType: 'listPayouts',
      messageVersion: '1.*',
      handler: this.handleList('Payouts').bind(this),
    });

    await this._amqp.consume({
      messageType: 'getProduct',
      messageVersion: '1.*',
      handler: this.handleGetEntity('Product').bind(this),
    });
  }

  /**
   * Handle create metadata message
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async handleCreateMetadata({ content, fields, properties }) {
    try {
      const { key, customerId } = await this.createMetadata(content, properties.headers.product);

      await this._amqp.publish({
        product: properties.headers.product,
        messageType: 'createMetadataResult',
        messageVersion: '1.*',
        content: { bpExternalKey: key, customerId },
        correlationId: properties.correlationId,
        customHeaders: properties.headers,
      });
    } catch (e) {
      await this._amqp.publish({
        product: properties.headers.product,
        messageType: 'createMetadataResult',
        messageVersion: '1.*',
        content: { error: e.message },
        correlationId: properties.correlationId,
        customHeaders: properties.headers,
      });
    }
  }

  /**
   * Handle create customer message
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async handleCreateCustomer({ content, fields, properties }) {
    try {
      const customerId = await this.createOrUpdateCustomer(content, properties.headers.product);

      await this._amqp.publish({
        product: properties.headers.product,
        messageType: 'createCustomerResult',
        messageVersion: '1.*',
        content: { customerId },
        correlationId: properties.correlationId,
        customHeaders: properties.headers,
      });
    } catch (e) {
      await this._amqp.publish({
        product: properties.headers.product,
        messageType: 'createCustomerResult',
        messageVersion: '1.*',
        content: { error: e.message },
        correlationId: properties.correlationId,
        customHeaders: properties.headers,
      });
    }
  }

  /**
   * Handle get entity from db request
   * @param {String} entity
   * @return {Function}
   */
  handleGetEntity(entity) {
    return async ({ content, fields, properties }) => {
      try {
        const { base, extra, error } = await this.getEntityByIdentifier(
          entity, content.id, properties.headers.product, content.identifier,
        );

        if (error) {
          throw new Error(error);
        }

        const response = { ..._.omit(base, ['product']), ...extra };

        await this._amqp.publish({
          product: properties.headers.product,
          messageType: `get${entity}Result`,
          messageVersion: '1.*',
          content: response,
          correlationId: properties.correlationId,
          customHeaders: properties.headers,
        });
      } catch (e) {
        await this._amqp.publish({
          product: properties.headers.product,
          messageType: `get${entity}Result`,
          messageVersion: '1.*',
          content: { error: e.message },
          correlationId: properties.correlationId,
          customHeaders: properties.headers,
        });
      }
    };
  }

  /**
   * Get entiry from db by id
   * @param {String} entity
   * @param {Number} id
   * @param {String} product
   * @param {String} identifier
   * @return {Promise<*>}
   */
  async getEntityByIdentifier(entity, id, product, identifier = 'id') {
    if (entity === 'Customer') {
      const { Customer, CustomerExtra } = this._models;

      if (identifier !== 'id') return { error: 'ERROR::INVALID_INENTIFIER_TYPE' };

      const base = await Customer.query().where({ id, product }).first();
      if (!base) return { error: 'ERROR::CUSTOMER_NOT_EXISTS' };

      const extra = await CustomerExtra.query().where('customerId', base.id)
        .then(rows => _.fromPairs(_.map(rows, r => [r.field, r.value])));

      return { base, extra };
    }

    if (entity === 'Metadata') {
      const { Metadata, MetadataExtra } = this._models;

      const base = await Metadata.query().where({ [identifier]: id, product }).first();
      if (!base) return { error: 'ERROR::METADATA_NOT_EXISTS' };

      const extra = await MetadataExtra.query().where('metadataKey', base.key)
        .then(rows => _.fromPairs(_.map(rows, r => [r.field, r.value])));

      return { base, extra };
    }

    if (entity === 'Application') {
      const { Applications, ApplicationsExtra } = this._models;

      const base = await Applications.query().where({ [identifier]: id, product }).first();
      if (!base) return { error: 'ERROR::APPLICATION_NOT_EXISTS' };

      const extra = await ApplicationsExtra.query().where('applicationKey', base.key)
        .then(rows => _.fromPairs(_.map(rows, r => [r.field, r.value])));

      return { base, extra };
    }

    if (entity === 'Policy') {
      const { Policies, PoliciesExtra } = this._models;

      const base = await Policies.query().where({ [identifier]: id, product }).first();
      if (!base) return { error: 'ERROR::POLICY_NOT_EXISTS' };

      const extra = await PoliciesExtra.query().where('policyKey', base.key)
        .then(rows => _.fromPairs(_.map(rows, r => [r.field, r.value])));

      return { base, extra };
    }

    if (entity === 'Claim') {
      const { Claims, ClaimsExtra } = this._models;

      const base = await Claims.query().where({ [identifier]: id, product }).first();
      if (!base) return { error: 'ERROR::CLAIM_NOT_EXISTS' };

      const extra = await ClaimsExtra.query().where('claimKey', base.key)
        .then(rows => _.fromPairs(_.map(rows, r => [r.field, r.value])));

      return { base, extra };
    }

    if (entity === 'Payout') {
      const { Payouts, PayoutsExtra } = this._models;

      const base = await Payouts.query().where({ [identifier]: id, product }).first();
      if (!base) return { error: 'ERROR::PAYOUT_NOT_EXISTS' };

      const extra = await PayoutsExtra.query().where('payoutKey', base.key)
        .then(rows => _.fromPairs(_.map(rows, r => [r.field, r.value])));

      return { base, extra };
    }

    if (entity === 'Product') {
      const { Products } = this._models;

      const base = await Products.query().where({
        product,
        approved: true,
      })
        .orderBy('productId', 'desc')
        .first();

      if (!base) return { error: 'ERROR::PRODUCT_NOT_EXISTS' };

      return { base };
    }

    return { error: 'ERROR::UNKNOWN_ENTITY' };
  }

  /**
   * Handle get customer message
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async handleGetCustomer({ content, fields, properties }) {
    try {
      const { customer, extra } = await this.getCustomerById(content.customerId, properties.headers.product);
      const response = { ..._.omit(customer, ['updated', 'product']), ...extra };

      await this._amqp.publish({
        product: properties.headers.product,
        messageType: 'getCustomerResult',
        messageVersion: '1.*',
        content: response,
        correlationId: properties.correlationId,
        customHeaders: properties.headers,
      });
    } catch (e) {
      await this._amqp.publish({
        product: properties.headers.product,
        messageType: 'getCustomerResult',
        messageVersion: '1.*',
        content: { error: e.message },
        correlationId: properties.correlationId,
        customHeaders: properties.headers,
      });
    }
  }

  /**
   * Handle get list of customers message
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async handleListCustomers({ content, fields, properties }) {
    try {
      const response = await this.getCustomers(properties.headers.product);

      await this._amqp.publish({
        product: properties.headers.product,
        messageType: 'listCustomersResult',
        messageVersion: '1.*',
        content: response,
        correlationId: properties.correlationId,
        customHeaders: properties.headers,
      });
    } catch (e) {
      await this._amqp.publish({
        product: properties.headers.product,
        messageType: 'listCustomersResult',
        messageVersion: '1.*',
        content: { error: e.message },
        correlationId: properties.correlationId,
        customHeaders: properties.headers,
      });
    }
  }

  /**
   * Handle get list of entities request
   * @param {String} entity
   * @return {Function}
   */
  handleList(entity) {
    return async ({ content, fields, properties }) => {
      try {
        const response = await this.getList(entity, properties.headers.product);

        await this._amqp.publish({
          product: properties.headers.product,
          messageType: `list${entity}Result`,
          messageVersion: '1.*',
          content: response,
          correlationId: properties.correlationId,
          customHeaders: properties.headers,
        });
      } catch (e) {
        await this._amqp.publish({
          product: properties.headers.product,
          messageType: `list${entity}Result`,
          messageVersion: '1.*',
          content: { error: e.message },
          correlationId: properties.correlationId,
          customHeaders: properties.headers,
        });
      }
    };
  }

  /**
   * Get customer by id
   * @param {String} id
   * @param {String} product
   * @return {Promise<{extra: *, customer: *}>}
   */
  async getCustomerById(id, product) {
    const { Customer, CustomerExtra } = this._models;

    const customer = await Customer.query().where({
      id,
      product,
    }).first();

    if (!customer) {
      throw new Error('ERROR::CUSTOMER_NOT_EXISTS');
    }

    const extra = await CustomerExtra.query().where('customerId', customer.id)
      .then(rows => _.fromPairs(_.map(rows, r => [r.field, r.value])));

    return { customer, extra };
  }

  /**
   * Get list of customer
   * @param {String} product
   * @return {Promise<*>}
   */
  async getCustomers(product) {
    const { Customer } = this._models;

    const customers = await Customer.query()
      .where({ product }).eager('extra');

    return customers.map(customer => ({
      ..._.omit(customer, ['updated', 'product', 'extra']),
      ..._.fromPairs(_.map(customer.extra, r => [r.field, r.value])),
    }));
  }

  /**
   * Get list of entities from db
   * @param {String} entity
   * @param {String} product
   * @return {Promise<*>}
   */
  async getList(entity, product) {
    let list;

    if (entity === 'Customers') {
      const { Customer } = this._models;
      list = await Customer.query().where({ product }).eager('extra');
    }

    if (entity === 'Metadata') {
      const { Metadata } = this._models;
      list = await Metadata.query().where({ product }).eager('extra');
    }

    if (entity === 'Applications') {
      const { Applications } = this._models;
      list = await Applications.query().where({ product }).eager('extra');
    }

    if (entity === 'Policies') {
      const { Policies } = this._models;
      list = await Policies.query().where({ product }).eager('extra');
    }

    if (entity === 'Claims') {
      const { Claims } = this._models;
      list = await Claims.query().where({ product }).eager('extra');
    }

    if (entity === 'Payouts') {
      const { Payouts } = this._models;
      list = await Payouts.query().where({ product }).eager('extra');
    }

    return list.map(el => ({
      ..._.omit(el, ['updated', 'product', 'extra']),
      ..._.fromPairs(_.map(el.extra, r => [r.field, r.value])),
    }));
  }

  /**
   * Generate id for customer
   * @param {string} product
   * @param {string} firstname
   * @param {string} lastname
   * @param {string} email
   * @return {*}
   */
  generateCustomerId(product, firstname, lastname, email) {
    const salt = process.env.SALT || 'salt';
    return sha256(`${product}${firstname}${lastname}${email}${salt}`);
  }

  /**
   * Create new customer if doesn't exists
   * @param {{}} customer
   * @param {String} product
   * @return {string}
   */
  async createOrUpdateCustomer(customer, product) {
    if (!customer.firstname) throw new Error('ERROR::FIRSTNAME_NOT_PROVIDED');
    if (!customer.lastname) throw new Error('ERROR::LASTNAME_NOT_PROVIDED');
    if (!customer.email) throw new Error('ERROR::EMAIL_NOT_PROVIDED');

    const customerId = this.generateCustomerId(product, customer.firstname, customer.lastname, customer.email);

    const { Customer } = this._models;

    // Check if customer exists
    const customerExists = await Customer.query().where('id', customerId).first();

    // Create customer if it doesn't exists
    if (!customerExists) {
      await Customer.query().insertGraph({
        id: customerId,
        product,
        ..._.pick(customer, ['firstname', 'lastname', 'email']),
        extra: [
          ..._.map(
            _.toPairs(_.omit(customer, ['firstname', 'lastname', 'email'])),
            ([field, value]) => ({ field, value }),
          ),
        ],
      });
    } else {
      // Update customer data
      await Customer.query().upsertGraph({
        id: customerId,
        extra: [
          ..._.map(
            _.toPairs(_.omit(customer, ['firstname', 'lastname', 'email'])),
            ([field, value]) => ({ field, value }),
          ),
        ],
      });
    }

    return customerId;
  }

  /**
   * Create new policy
   * @param {string} customerId
   * @param {string} creationId
   * @param {{}} policy
   * @return {string}
   */
  async createPolicy(customerId, creationId, policy) {
    // Generate policy id
    const policyId = uuidV4();

    const { Policy } = this._models;

    // Create new policy
    await Policy.query().insertGraph({
      id: policyId,
      customerId,
      creationId,
      ..._.pick(policy, ['distributorId']),

      extra: [
        ..._.map(
          _.toPairs(_.omit(policy, ['distributorId'])),
          ([field, value]) => ({ field, value }),
        ),
      ],
    });

    return policyId;
  }

  /**
   * Get disctibutor
   * @param {string} distributorId
   * @return {*}
   */
  getDistributor(distributorId) {
    // Get models
    const { Distributor } = this._models;

    return Distributor.query().where('id', distributorId).first();
  }

  /**
   * Handle policy creation
   * @param {DipMessage} message
   * @return {*}
   */
  async onPolicyCreateMessage({ content, fields, properties }) {
    // Check if distributor exists
    const distributor = await this.getDistributor(content.policy.distributorId);
    const { creationId } = content;

    if (!distributor) {
      await this._amqp.publish({
        messageType: 'policyCreationError',
        messageVersion: '1.*',
        content: { creationId, customerId: null, error: 'Distributor does not exists' },
        correlationId: properties.correlationId,
      });
      return;
    }

    // Create customer if doesn't exists
    const customerId = await this.createOrUpdateCustomer(content.customer);

    // Create new policy
    const policyId = await this.createPolicy(customerId, creationId, content.policy);

    // Send payment details to payment gateway
    await this._amqp.publish({
      messageType: 'initializePayment',
      messageVersion: '1.*',
      content: {
        policyId,
        customer: {
          customerId,
          ...content.customer,
        },
        payment: content.payment,
      },
      correlationId: properties.correlationId,
    });
  }

  /**
   * Handle payment initialization result
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async onInitializePaymentResult({ content, fields, properties }) {
    const { policyId, error } = content;
    const { Policy } = this._models;

    const { creationId, customerId } = await Policy.query()
      .select('creationId', 'customerId')
      .where({ id: policyId })
      .first();

    if (error) {
      // TODO: Do we need to delete these? Seems like they would benefit from being labeled as failed.
      const { PolicyExtra } = this._models;
      await PolicyExtra.query()
        .delete()
        .where({ policyId });
      await Policy.query()
        .delete()
        .where({ id: policyId });

      await this._amqp.publish({
        messageType: 'policyCreationError',
        messageVersion: '1.*',
        content: { creationId, customerId, error },
        correlationId: properties.correlationId,
      });
    } else {
      // Publish message about successful policy creation
      await this._amqp.publish({
        messageType: 'policyCreationSuccess',
        messageVersion: '1.*',
        content: { creationId, customerId, policyId },
        correlationId: properties.correlationId,
      });
    }
  }

  /**
   * Get policy message handler
   * @param {DipMessage} message
   * @return {*}
   */
  async onPolicyGetMessage({ content, fields, properties }) {
    // Get models
    const { Customer, Policy, PolicyExtra } = this._models;
    const { policyId } = content;

    const policy = await Policy.query().where('id', policyId).first();
    const extra = await PolicyExtra.query().where('policyId', policyId)
      .then(rows => _.fromPairs(_.map(rows, r => [r.field, r.value])));

    if (!policy) {
      await this._amqp.publish({
        messageType: 'policyGetRequestError',
        messageVersion: '1.*',
        content: { error: 'Policy not found' },
        correlationId: properties.correlationId,
      });
      return;
    }

    const customer = await Customer.query().where('id', policy.customerId).first();

    await this._amqp.publish({
      messageType: 'policyGetResponse',
      messageVersion: '1.*',
      content: {
        id: policy.id,
        customerId: policy.customerId,
        distributorId: policy.distributorId,
        extra,
        customer: {
          firstname: customer.firstname,
          lastname: customer.lastname,
          email: customer.email,
        },
      },
      correlationId: properties.correlationId,
    });
  }

  /**
   * Handle contact event
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async handleApplyForPolicySuccess({ content, fields, properties }) {
    const { contractApplicationId, policyId } = content;
    const { Policy } = this._models;
    await Policy.query()
      .update({ contractApplicationId })
      .where('id', policyId);
  }

  /**
   * Handle contact event
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async handleApplyForPolicyError({ content, fields, properties }) {
    const { policyId } = content;
    const { Policy, PolicyExtra } = this._models;
    await PolicyExtra.query().delete().where('policyId', policyId);
    await Policy.query().delete().where('id', policyId);
  }

  /**
   * New policy created handler
   * @param {*} contractApplicationId
   * @param {*} contractPolicyId
   */
  async newPolicyCreated(contractApplicationId, contractPolicyId) {
    const { Policy } = this._models;
    await Policy.query()
      .update({ contractPolicyId })
      .where({ contractApplicationId });
  }

  /**
   * Handle contact event
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async handleDecodedEvent({ content, fields, properties }) {
    const eventHandlers = {
      LogNewProduct: this.handleProductEvt.bind(this),
      LogProductApproved: this.handleProductEvt.bind(this),
      LogNewMetadata: this.handleMetadataEvt.bind(this),
      LogMetadataStateChanged: this.handleMetadataEvt.bind(this),
      LogNewApplication: this.handleApplicationEvt.bind(this),
      LogApplicationStateChanged: this.handleApplicationEvt.bind(this),
      LogNewPolicy: this.handlePolicyEvt.bind(this),
      LogPolicyStateChanged: this.handlePolicyEvt.bind(this),
      LogNewClaim: this.handleClaimEvt.bind(this),
      LogClaimStateChanged: this.handleClaimEvt.bind(this),
      LogNewPayout: this.handlePayoutEvt.bind(this),
      LogPayoutStateChanged: this.handlePayoutEvt.bind(this),
      LogPayoutCompleted: this.handlePayoutEvt.bind(this),
      LogPartialPayout: this.handlePayoutEvt.bind(this),
    };

    const handler = eventHandlers[content.eventName];

    if (handler) {
      await handler({ content, fields, properties });
    }
  }

  /**
   * Save artifact
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async saveArtifact({ content, fields, properties }) {
    const {
      network, networkId, version, artifact,
    } = content;

    const { product } = properties.headers;
    const isProductDeployment = product !== 'platform';

    const { Contracts, Products } = this._models;

    try {
      if (!product) {
        throw new Error('Product is not defined');
      }

      const { networks, abi, contractName } = JSON.parse(artifact);
      const { address } = networks[networkId];

      const checkAddressExistance = await Contracts.query().findOne({
        networkName: network,
        address: address.toLowerCase(),
      });

      if (checkAddressExistance) {
        if (isProductDeployment) {
          throw new Error(`Contract ${address} exists`);
        }
        return;
      }

      const contractLookupCriteria = {
        product,
        networkName: network,
        contractName,
        version,
      };

      const updateValues = {
        address: address.toLowerCase(),
        abi: JSON.stringify(abi),
      };

      if (isProductDeployment) {
        // GOD MODE ON
        const productInContract = await Products.query().findOne({
          addr: address.toLowerCase(),
        });

        if (!productInContract) {
          throw new Error('Contract not registered on Ethereum in GIF service contract');
        }

        if (productInContract.product && productInContract.product !== product) {
          throw new Error(`Ethereum contract ${address} belongs to another product`);
        }

        if (!productInContract.approved && !productInContract.product) {
          await this._amqp.publish({
            messageType: 'contractTransactionRequest',
            messageVersion: '1.*',
            content: {
              contractName: 'InstanceOperatorService',
              methodName: 'approveProduct',
              parameters: [productInContract.productId],
            },
            correlationId: properties.correlationId,
            customHeaders: {
              product: 'platform',
            },
          });
        } else {
          throw new Error('Product already exists and approved');
        }

        await this._amqp.publish({
          product: properties.headers.product,
          messageType: 'contractDeploymentResult',
          messageVersion: '1.*',
          content: {
            result: 'Artifact saved',
            product,
            contractName,
            address,
            network,
            version,
          },
          correlationId: properties.correlationId,
          customHeaders: properties.headers,
        });
      }

      const checkVersionExistance = await Contracts.query().findOne(contractLookupCriteria);

      if (!checkVersionExistance) {
        await Contracts.query()
          .upsertGraph({ ...contractLookupCriteria, ...updateValues });
      } else {
        await Contracts.query()
          .where(contractLookupCriteria)
          .update(updateValues);
      }

      this._log.info(`Artifact saved: ${product} ${contractName} (${address})`);
    } catch (error) {
      if (isProductDeployment) {
        await this._amqp.publish({
          product: properties.headers.product,
          messageType: 'contractDeploymentResult',
          messageVersion: '1.*',
          content: {
            error: error.message,
          },
          correlationId: properties.correlationId,
          customHeaders: properties.headers,
        });
      }

      this._log.error(new Error(JSON.stringify({ message: error.message, stack: error.stack })));
    }
  }

  /**
   * Handle get artifact event
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async handleGetArtifact({ content, fields, properties }) {
    try {
      const { contractName } = content;

      const { product } = properties.headers;

      if (!product) {
        throw new Error('Product is not defined');
      }

      if (!contractName) {
        throw new Error('ContractName is not defined');
      }

      const response = await this.getArtifact(product, process.env.NETWORK_NAME, contractName);

      await this._amqp.publish({
        product: properties.headers.product,
        messageType: 'getArtifactResult',
        messageVersion: '1.*',
        content: response,
        correlationId: properties.correlationId,
        customHeaders: properties.headers,
      });
    } catch (e) {
      await this._amqp.publish({
        product: properties.headers.product,
        messageType: 'getArtifactResult',
        messageVersion: '1.*',
        content: { error: e.message },
        correlationId: properties.correlationId,
        customHeaders: properties.headers,
      });
    }
  }

  /**
   * Get artifact
   * @param {Stirng} product
   * @param {String} networkName
   * @param {String} contractName
   * @return {Promise<{address: *, name: *, abi: string, version: *, network: *}>}
   */
  async getArtifact(product, networkName, contractName) {
    const { Contracts } = this._models;

    const contract = await Contracts.query().findOne({
      product,
      networkName,
      contractName,
    });

    return {
      name: contract.contractName,
      abi: JSON.stringify(contract.abi),
      network: contract.networkName,
      version: contract.version,
      address: contract.address,
    };
  }

  /**
   * Get data from Ethereum contract
   * @param {String} address
   * @param {String} method
   * @param {Array} params
   * @param {String} interfaceContract
   * @return {Promise<void>}
   */
  async getContractData(address, method, params, interfaceContract) {
    const { Contracts } = this._models;

    const contractData = await Contracts.query().findOne({
      address: interfaceContract || address,
      networkName: process.env.NETWORK_NAME,
    });

    const abi = JSON.parse(contractData.abi);
    const contract = new this._web3.eth.Contract(abi, address);
    const methodDescription = abi.find(m => m.name === method);
    const callData = await contract.methods[method](...params).call();

    /**
     * Format values
     * @param {*} value
     * @param {String} type
     * @return {*}
     */
    const format = (value, type) => {
      if (/bytes/.test(type)) {
        // e.g. bytes32
        return this._web3.utils.toUtf8(value);
      }

      if (type === 'address') {
        return value.toLowerCase();
      }

      if (/int[\d]+\[\]/.test(type)) {
        // e.g. uint256[], int64[]
        return value.map(el => el.toString());
      }

      if (/int/.test(type)) {
        // e.g. uint256, int256
        return value.toString();
      }

      return value;
    };

    const { outputs } = methodDescription;

    if (!_.isPlainObject(callData)) {
      return format(callData, outputs[0].type);
    }

    const data = _.omit(callData, _.filter(_.keys(callData), k => !_.isNaN(Number(k))));
    for (let i = 0; i < outputs.length; i += 1) {
      const paramFormat = outputs[i];

      data[paramFormat.name] = format(data[paramFormat.name], paramFormat.type);
    }

    return data;
  }

  /**
   * Get contract by address
   * @param {String} address
   * @return {Promise<QM>}
   */
  async getContractByAddress(address) {
    const { Contracts } = this._models;

    const contract = await Contracts.query().findOne({
      address,
      networkName: process.env.NETWORK_NAME,
    });

    return contract;
  }

  /**
   * Get product by id
   * @param {Number} productId
   * @return {Promise<void>}
   */
  async getProductNameById(productId) {
    const { Products } = this._models;

    const { product } = await Products.query().select('product').findOne({ productId });

    return product;
  }

  /**
   * Product's changes event handler
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async handleProductEvt({ content, fields, properties }) {
    const { productId } = content.eventArgs;
    const { Products } = this._models;

    const data = await this.getContractData(content.address, 'products', [productId]);

    if (content.eventName === 'LogNewProduct') {
      // insert
      await Products.query().insert({ productId, ...data });
    } else {
      // update
      const productContract = await this.getContractByAddress(data.addr);
      await Products.query().update({ product: productContract.product, ...data }).where({ productId });
    }
  }

  /**
   * Create new metadata
   * @param {Object} bp
   * @param {String} product
   * @return {Promise<{customerId: *, key: *}>}
   */
  async createMetadata(bp, product) {
    if (!bp.customerId && !bp.customer) {
      throw new Error(errorMessages.NEITHER_CUSTOMERID_NOR_CUSTOMER);
    }

    let customerId;

    if (bp.customerId) {
      const customer = await this.getEntityByIdentifier('Customer', bp.customerId, product);
      if (customer.error) {
        throw new Error(customer.error);
      }

      if (bp.customer) {
        if (bp.customer.firstname || bp.customer.lastname || bp.customer.email) {
          throw new Error(errorMessages.CUSTOMER_OVERRIDE_DISALLOWED);
        }
        await this.createOrUpdateCustomer({ ...customer.base, ...bp.customer }, product);
      }

      customerId = bp.customerId; // eslint-disable-line
    } else {
      customerId = await this.createOrUpdateCustomer(bp.customer, product);
    }

    const key = randomId();

    const { Metadata } = this._models;

    await Metadata.query().insertGraph({
      key,
      product,
      customerId,
      extra: [
        ..._.map(_.toPairs(_.omit(bp, ['customerId', 'customer'])), ([field, value]) => ({ field, value })),
      ],
    });

    return { key, customerId };
  }

  /**
   * Metadata's changes event handler
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async handleMetadataEvt({ content, fields, properties }) {
    const { productId, metadataId } = content.eventArgs;
    const { address, eventName } = content;

    if (eventName === 'LogNewMetadata') {
      await this.linkMetadata(productId, metadataId, address);
    } else {
      await this.sync('metadata', productId, metadataId, address, 'update');
    }
  }

  /**
   * Application's changes event handler
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async handleApplicationEvt({ content, fields, properties }) {
    const { productId, applicationId } = content.eventArgs;
    const { address, eventName } = content;

    const syncType = eventName === 'LogNewApplication' ? 'insert' : 'update';
    const data = await this.sync('application', productId, applicationId, address, syncType);
    await this.sync('metadata', productId, data.metadataId, address, 'update');
  }

  /**
   * Policy's changes event handler
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async handlePolicyEvt({ content, fields, properties }) {
    // todo: refactor fdd legacy code
    // if (content.eventName === 'LogNewPolicy') {
    //   const { applicationId: contractApplicationId, policyId: contractPolicyId } = content.eventArgs;
    //   await this.newPolicyCreated(contractApplicationId, contractPolicyId);
    // }

    const { productId, policyId } = content.eventArgs;
    const { address, eventName } = content;

    const syncType = eventName === 'LogNewPolicy' ? 'insert' : 'update';
    const data = await this.sync('policy', productId, policyId, address, syncType);
    await this.sync('metadata', productId, data.metadataId, address, 'update');
  }

  /**
   * Claim's changes event handler
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async handleClaimEvt({ content, fields, properties }) {
    const { productId, claimId } = content.eventArgs;
    const { address, eventName } = content;

    const syncType = eventName === 'LogNewClaim' ? 'insert' : 'update';
    const data = await this.sync('claim', productId, claimId, address, syncType);
    await this.sync('metadata', productId, data.metadataId, address, 'update');
  }

  /**
   * Payout's changes event handler
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async handlePayoutEvt({ content, fields, properties }) {
    const { productId, payoutId } = content.eventArgs;
    const { address, eventName } = content;

    const syncType = eventName === 'LogNewPayout' ? 'insert' : 'update';
    const data = await this.sync('payout', productId, payoutId, address, syncType);
    await this.sync('metadata', productId, data.metadataId, address, 'update');
  }

  /**
   * Link metadata object in contract with db
   * @param {String} productId
   * @param {Number }id
   * @param {String} address
   * @return {Promise<void>}
   */
  async linkMetadata(productId, id, address) {
    const { Metadata } = this._models;

    const product = await this.getProductNameById(productId);
    const data = await this.getContractData(address, 'metadata', [productId, id]);

    // update
    await Metadata.query().update({ productId, id, ...data }).where({ product, key: data.bpExternalKey });
  }

  /**
   * Sync object from contract with db
   * @param {String} entity
   * @param {Number} productId
   * @param {Number} id
   * @param {String} address
   * @param {String} syncType
   * @return {Promise<void>}
   */
  async sync(entity, productId, id, address, syncType) {
    let dbModel;
    let getMethod;

    if (entity === 'payout') {
      dbModel = this._models.Payouts;
      getMethod = 'payouts';
    }

    if (entity === 'claim') {
      dbModel = this._models.Claims;
      getMethod = 'claims';
    }

    if (entity === 'policy') {
      dbModel = this._models.Policies;
      getMethod = 'policies';
    }

    if (entity === 'application') {
      dbModel = this._models.Applications;
      getMethod = 'applications';
    }

    if (entity === 'metadata') {
      dbModel = this._models.Metadata;
      getMethod = 'metadata';
    }

    if (!dbModel && !getMethod) {
      throw new Error('Invalid sync options');
    }

    const data = await this.getContractData(address, getMethod, [productId, id]);

    if (entity === 'application') {
      const policyController = await this.getContractData(address, 'controller', []);
      const payoutOptions = await this.getContractData(address, 'getPayoutOptions', [productId, id], policyController);

      data.payoutOptions = JSON.stringify(payoutOptions);
    }

    const product = await this.getProductNameById(productId);

    if (syncType === 'insert') {
      const key = randomId();
      await dbModel.query().insert({
        key,
        product,
        productId,
        id,
        ...data,
      });
    } else {
      // update
      await dbModel.query().update({ ...data }).where({ product, productId, id });
    }

    return data;
  }
}

module.exports = PolicyStorage;
