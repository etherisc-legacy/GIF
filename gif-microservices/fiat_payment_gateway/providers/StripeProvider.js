const stripe = require('stripe');

/**
 * Stripe payment gateway provider
 */
class StripeProvider {
  /**
   * Constructor
   * @param {string} secretKey
   */
  constructor(secretKey) {
    this._client = stripe(secretKey || 'sk_test_55VxCBH8ygdTUGbta0jAiIJk');

    this.MAX_POOL_COUNT = 10;
  }

  /**
   * Check source card status
   * @param {string} sourceId
   * @return {Promise}
   */
  checkSourceStatus(sourceId) {
    let poolCount = 0;

    return new Promise((resolve, reject) => {
      /**
       * Pool source status
       */
      const check = () => {
        this._client.sources.retrieve(sourceId)
          .then((source) => {
            if (source.status === 'chargeable') {
              resolve(source.status);
            } else if (source.status === 'pending' && poolCount < this.MAX_POOL_COUNT) {
              poolCount += 1;
              setTimeout(check, 1500);
            } else {
              reject(new Error('Card is not chargeable'));
            }
          });
      };

      check();
    });
  }

  /**
   * Create stripe customer
   * @param {{}} data
   * @return {Promise<{customerId: *, sourceId: *}>}
   */
  async initializePayment(data) {
    const { customer, payment } = data;
    const { email } = customer;
    const { sourceId } = payment;

    await this.checkSourceStatus(sourceId);

    const result = await this._client.customers.create({
      email,
      source: sourceId,
    });

    return {
      customerId: result.id,
      sourceId,
    };
  }

  /**
   * Charge card
   * @param {{}} data
   * @return {Promise<{chargeId: *}>}
   */
  async processPayment(data) {
    const charge = await this._client.charges.create({
      amount: data.premium,
      currency: data.currency,
      customer: data.customerId,
      source: data.sourceId,
    });

    return {
      chargeId: charge.id,
    };
  }
}

module.exports = StripeProvider;
