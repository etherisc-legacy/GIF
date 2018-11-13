/**
 * DIP Ethereum Client microservice
 */
class DipEtheremClient {
  /**
   * Constructor
   * @param {object} amqp
   */
  constructor({ amqp }) {
    this._amqp = amqp;
  }

  /**
   * Bootstap and listen
   * @return {Promise<void>}
   */
  async bootstrap() {
    await this._amqp.consume({
      messageType: 'policyCreationSuccess',
      messageVersion: '1.*',
      handler: this.createTransaction.bind(this),
    });
  }

  /**
   * Handle successful policy creation message
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {Promise<void>}
   */
  async createTransaction({ content, fields, properties }) {
    // const { routingKey } = message.fields;

    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this._amqp.publish({
      messageType: 'transactionCreated',
      messageVersion: '1.*',
      content: { policyId: content.policyId },
      correlationId: properties.correlationId,
    });

    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    await this._amqp.publish({
      messageType: 'stateChanged',
      messageVersion: '1.*',
      content: { policyId: content.policyId, state: 0 },
      correlationId: properties.correlationId,
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    await this._amqp.publish({
      messageType: 'stateChanged',
      messageVersion: '1.*',
      content: { policyId: content.policyId, state: 1 },
      correlationId: properties.correlationId,
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    await this._amqp.publish({
      messageType: 'stateChanged',
      messageVersion: '1.*',
      content: { policyId: content.policyId, state: 3 },
      correlationId: properties.correlationId,
    });
  }
}

module.exports = DipEtheremClient;
