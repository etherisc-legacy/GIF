const _ = require('lodash');
const models = require('./models/module');
const StripeProvider = require('./providers/StripeProvider');


const PAYMENT_CREATED_STATUS = 'created';
const CHARGED_STATUS = 'charged';
const CHARGE_ERROR_STATUS = 'charge_error';

/**
 * DIP Fiat Payment Gateway microservice
 */
class FiatPaymentGateway {
  /**
   * Constructor
   * @param {{}} params
   * @param {{}} params.db
   * @param {{}} params.amqp
   * @param {{}} params.log
   */
  constructor({ db, amqp, log }) {
    this._models = models(db);
    this._amqp = amqp;
    this._log = log;

    this.providers = {};
  }

  /**
   * Register payment provider
   * @param {string} name
   * @param {object} provider
   */
  registerProvider(name, provider) {
    this.providers[name] = provider;
  }

  /**
   * Bootstrap and listen
   * @return {Promise<void>}
   */
  async bootstrap() {
    this.registerProvider('stripe', new StripeProvider(process.env.STRIPE_SECRET_KEY));

    await this._amqp.consume({
      messageType: 'initializePayment',
      messageVersion: '1.*',
      handler: this.onInitializePayment.bind(this),
    });

    await this._amqp.consume({
      messageType: 'processPayment',
      messageVersion: '1.*',
      handler: this.onProcessPayment.bind(this),
    });
  }

  /**
   * Error handler
   * @param {string} policyId
   * @param {string} messageType
   * @param {string} error
   * @param {string} correlationId
   */
  onError(policyId, messageType, error, correlationId) {
    this._amqp.publish({
      messageType,
      messageVersion: '1.*',
      content: {
        policyId,
        error,
      },
      correlationId,
    });
  }

  /**
   * Initialize payment request handler
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async onInitializePayment({ content, fields, properties }) {
    const { provider, premium, currency } = content.payment;
    const { correlationId } = properties;
    const { policyId } = content;
    const { Payment } = this._models;

    try {
      const paymentDetails = await this.providers[provider].initializePayment(content);

      await Payment.query().insertGraph({
        policyId,
        provider,
        premium,
        currency,
        status: PAYMENT_CREATED_STATUS,
        data: [
          ..._.map(_.toPairs(paymentDetails), ([field, value]) => ({ field, value })),
        ],
      });

      this._amqp.publish({
        messageType: 'initializePaymentResult',
        messageVersion: '1.*',
        content: {
          policyId,
        },
        correlationId,
      });
    } catch (error) {
      this.onError(policyId, 'initializePaymentResult', error.message, correlationId);
    }
  }

  /**
   * Process payment handler
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async onProcessPayment({ content, fields, properties }) {
    const { policyId } = content;
    const { correlationId } = properties;
    const { Payment } = this._models;

    const paymentRaw = await Payment.query().findOne({ policyId }).eager('data');
    const payment = {
      ..._.omit(paymentRaw, ['data', 'created', 'updated']),
      ..._.fromPairs(paymentRaw.data.map(el => [el.field, el.value])),
    };

    try {
      // Process payment
      const charge = await this.providers[payment.provider].processPayment(payment)
        .catch((err) => {
          const error = err;
          error.name = 'PROCESS_PAYMENT_ERROR';
          throw error;
        });

      // Save result to the db
      await Payment.query().upsertGraph({
        id: payment.id,
        status: CHARGED_STATUS,
        data: [
          ..._.map(_.toPairs(charge), ([field, value]) => ({ field, value })),
        ],
      }, { noDelete: true })
        .catch((err) => {
          const error = err;
          error.name = 'DATABASE_ERROR';
          throw error;
        });

      // Send a message about successful payment processing
      await this._amqp.publish({
        messageType: 'processPaymentResult',
        messageVersion: '1.*',
        content: {
          policyId,
        },
        correlationId,
      })
        .catch((err) => {
          const error = err;
          error.name = 'AMQP_ERROR';
          throw error;
        });

      this._log.info(`Payment for policy ${policyId} processed successfully.`);
    } catch (error) {
      await Payment.query().upsertGraph({
        id: payment.id,
        status: CHARGE_ERROR_STATUS,
        data: [
          { field: error.name, value: error.message },
        ],
      });

      this._log.error(`Payment error - ${error.message} (${error.name}; id: ${payment.id} )`);
      this.onError(policyId, 'processPaymentResult', error.message, correlationId);
    }
  }
}

module.exports = FiatPaymentGateway;
