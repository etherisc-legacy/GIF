const uuid = require('uuid/v1');
const sha256 = require('js-sha256');
const _ = require('lodash');
const models = require('./models/module');

/**
 * Dip Policy Storage
 */
class PolicyStorage {
  /**
   * Constructor
   * @param {Amqp} amqp
   */
  constructor({ amqp, db }) {
    this._amqp = amqp;

    this._models = models(db);
  }

  /**
   * Start application
   * @return {Promise<void>}
   */
  async bootstrap() {
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
  }

  /**
   * Generate id for customer
   * @param {string} firstname
   * @param {string} lastname
   * @param {string} email
   * @return {*}
   */
  generateCustomerId(firstname, lastname, email) {
    const salt = process.env.SALT || 'salt';
    return sha256(`${firstname}${lastname}${email}${salt}`).slice(0, 31);
  }

  /**
   * Create new customer if doesn't exists
   * @param {{}} customer
   * @return {string}
   */
  async createCustomerIfNotExists(customer) {
    const customerId = this.generateCustomerId(customer.firstname, customer.lastname, customer.email);

    const { Customer } = this._models;

    // Check if customer exists
    const customerExists = await Customer.query().where('id', customerId).first();

    // Create customer if it doesn't exists
    if (!customerExists) {
      await Customer.query().insertGraph({
        id: customerId,
        ..._.pick(customer, ['firstname', 'lastname', 'email']),
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
    const policyId = uuid();

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
    const customerId = await this.createCustomerIfNotExists(content.customer);

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
    const { contractAppicationId, policyId } = content;
    const { Policy } = this._models;
    await Policy.query()
      .update({ contractAppicationId })
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
   * Handle contact event
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async handleDecodedEvent({ content, fields, properties }) {
    if (content.eventName === 'LogNewPolicy') {
      const { applicationId: contractAppicationId, policyId: contractPolicyId } = content.eventArgs;
      await this.newPolicyCreated(contractAppicationId, contractPolicyId);
    }
  }

  /**
   * New policy created handler
   * @param {*} contractAppicationId
   * @param {*} contractPolicyId
   */
  async newPolicyCreated(contractAppicationId, contractPolicyId) {
    const { Policy } = this._models;
    await Policy.query()
      .update({ contractPolicyId })
      .where({ contractAppicationId });
  }
}

module.exports = PolicyStorage;
