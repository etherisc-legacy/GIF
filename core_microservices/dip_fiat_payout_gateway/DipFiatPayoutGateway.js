/**
 * DIP Fiat Payout Gateway microservice
 */
class DipFiatPayoutGateway {
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
      messageType: 'payout',
      messageVersion: '1.*',
      handler: this.payout.bind(this),
    });
  }

  /**
   * Handle payout event message
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   * @return {Promise<void>}
   */
  async payout({ content, fields, properties }) {
    // const { routingKey } = message.fields;

    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this._amqp.publish({
      messageType: 'paidOut',
      messageVersion: '1.*',
      content: { policyId: content.policyId },
      correlationId: properties.correlationId,
    });
  }
}

module.exports = DipFiatPayoutGateway;
