const uuid = require('uuid/v1');
const sha256 = require('js-sha256');
const _ = require('lodash');
const models = require('./models/module');

/**
 * Dip Policy Storage
 */
class DipPolicyStorage {
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
    this._amqp.consume({
      messageType: 'policyCreationRequest',
      messageVersion: '1.*',
      handler: this.onPolicyCreateMessage.bind(this),
    });

    this._amqp.consume({
      messageType: 'initializePaymentResult',
      messageVersion: '1.*',
      handler: this.onInitializePaymentResult.bind(this),
    });

    this._amqp.consume({
      messageType: 'policyGetRequest',
      messageVersion: '1.*',
      handler: this.onPolicyGetMessage.bind(this),
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
   * @param {{}} policy
   * @return {string}
   */
  async createPolicy(customerId, policy) {
    // Generate policy id
    const policyId = uuid();

    const { Policy } = this._models;

    // Create new policy
    await Policy.query().insertGraph({
      id: policyId,
      customerId,
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

    if (!distributor) {
      await this._amqp.publish({
        messageType: 'policyCreationError',
        messageVersion: '1.*',
        content: { error: 'Distributor does not exists' },
        correlationId: properties.correlationId,
      });
      return;
    }

    // Create customer if doesn't exists
    const customerId = await this.createCustomerIfNotExists(content.customer);

    // Create new policy
    const policyId = await this.createPolicy(customerId, content.policy);

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

    if (error) {
      const { Policy } = this._models;

      await Policy.query()
        .delete()
        .where({ policyId });

      await this._amqp.publish({
        messageType: 'policyCreationError',
        messageVersion: '1.*',
        content: { error },
        correlationId: properties.correlationId,
      });
    } else {
      // Publish message about successful policy creation
      await this._amqp.publish({
        messageType: 'policyCreationSuccess',
        messageVersion: '1.*',
        content: { policyId },
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
    const { Customer, Policy } = this._models;

    const policy = await Policy.query().where('id', content.policyId).first();

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
        extra: { ...policy.extra },
        customer: {
          firstname: customer.firstname,
          lastname: customer.lastname,
          email: customer.email,
        },
      },
      correlationId: properties.correlationId,
    });
  }
}

module.exports = DipPolicyStorage;
