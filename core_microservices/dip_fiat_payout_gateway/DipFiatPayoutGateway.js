const { transaction } = require('objection');
const models = require('./models/module');
const TransferwisePlugin = require('./providers/transferwise/transferwisePlugin');


/**
 * DIP Fiat Payout Gateway microservice
 */
class DipFiatPayoutGateway {
  /**
   * Constructor
   * @param {object} amqp
   * @param {object} db
   */
  constructor({ amqp, db }) {
    this._amqp = amqp;
    this._models = models(db);
    this.providers = new Map();
  }

  /**
   * Bootstrap and listen
   * @return {Promise<void>}
   */
  async bootstrap() {
    this._registerProvider('transferwise', new TransferwisePlugin({
      profileId: process.env.TRANSFERWISE_PROFILE_ID,
      url: process.env.TRANSFERWISE_API_URL,
      token: process.env.TRANSFERWISE_API_TOKEN,
    }));
    await this._amqp.consume({
      messageType: 'payout',
      messageVersion: '1.*',
      handler: this.handlePayout.bind(this),
    });
    await this._amqp.consume({
      messageType: 'policyGetResponse',
      messageVersion: '1.*',
      handler: this.policyGetResponse.bind(this),
    });
  }

  /**
   * Register payout provider
   * @param {string} name
   * @param {object} provider
   */
  _registerProvider(name, provider) {
    this.providers.set(name, provider);
  }

  /**
   * on error
   * @param {string} policyId
   * @param {string} messageType
   * @param {string} error
   * @param {string} correlationId
   */
  async _onError(policyId, messageType, error, correlationId) {
    await this._amqp.publish({
      messageType,
      messageVersion: '1.*',
      content: { policyId, error },
      correlationId,
    });
  }

  /**
   * Handle contract event
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async handlePayout({ content, fields, properties }) {
    const {
      policyId,
      payoutAmount,
      currency,
      provider,
    } = content;

    if (!this.providers.has(provider)) {
      await this._onError(
        policyId,
        'payoutError',
        `Payout provider ${provider} not found`,
        properties.correlationId,
      );
      return;
    }

    const { Payout } = this._models;

    await Payout.query().insert({
      policyId,
      payoutAmount,
      currency,
      provider,
    });

    await this._amqp.publish({
      messageType: 'policyGetRequest',
      messageVersion: '1.*',
      content: { policyId },
      correlationId: properties.correlationId,
    });
  }

  /**
   * Handle get policy message
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async policyGetResponse({ content, fields, properties }) {
    const policy = content;

    try {
      const { Payout } = this._models;

      // find payout and update status
      const payout = await transaction(Payout.knex(), async (trx) => {
        let p = await Payout.query(trx).where({
          policyId: policy.id,
          status: 'new',
        }).first();

        if (!p) {
          return null;
        }

        p = await p.$query(trx).updateAndFetch({ status: 'in_progress' });

        return p;
      });

      if (!payout) { // payout not found
        return;
      }

      if (!this.providers.has(payout.provider)) { // payout plugin not found
        await this._onError(
          policy.id,
          'payoutError',
          `Payout provider ${payout.provider} not found`,
          properties.correlationId,
        );
        return;
      }

      const provider = this.providers.get(payout.provider);

      try {
        // Initialize Payout
        const transfer = await provider.initializePayout({
          name: `${policy.customer.firstname} ${policy.customer.lastname}`,
          email: policy.customer.email,
          currency: payout.currency,
          amount: payout.payoutAmount,
        });

        // Process Payout
        await provider.processPayout(transfer);
      } catch (error) {
        // update payout status to failed
        await payout.$query().update({ status: 'failed' });
        throw error;
      }

      // update payout status
      await payout.$query().update({ status: 'finished' });

      await this._amqp.publish({
        messageType: 'paidOut',
        messageVersion: '1.*',
        content: { policyId: policy.id },
        correlationId: properties.correlationId,
      });
    } catch (error) {
      await this._onError(policy.id, 'payoutError', error.toString(), properties.correlationId);
    }
  }
}

module.exports = DipFiatPayoutGateway;
