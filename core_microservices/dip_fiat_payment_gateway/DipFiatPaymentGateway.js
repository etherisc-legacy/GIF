/**
 * DIP Fiat Payment Gateway microservice
 */
class DipFiatPaymentGateway {
  /**
   * Constructor
   * @param {object} amqp
   */
  constructor({ amqp }) {
    this._amqp = amqp;
  }

  /**
   * Bootstrap and listen
   * @return {Promise<void>}
   */
  async bootstrap() {
    await this._amqp.consume({
      messageType: 'chargeCard',
      messageVersion: '1.*',
      handler: this.chargeCard.bind(this),
    });
  }

  /**
   * Handle card charding message
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   * @return {Promise<void>}
   */
  async chargeCard({ content, fields, properties }) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this._amqp.publish({
      messageType: 'cardCharged',
      messageVersion: '1.*',
      content: { policyId: content.policyId },
      correlationId: properties.correlationId,
    });
  }
}

module.exports = DipFiatPaymentGateway;
