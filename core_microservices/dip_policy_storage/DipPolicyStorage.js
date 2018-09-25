const amqp = require('amqplib');

/**
 * DIP Policy Storage microservice
 */
class DipPolicyStorage {
  /**
   * Constructor
   * @param {string} amqpBroker
   */
  constructor({ amqpBroker }) {
    this._amqpBroker = amqpBroker;
    this._amqp = null;
  }

  /**
   * Bootstrap and listen
   * @return {Promise<void>}
   */
  async listen() {
    const conn = await amqp.connect(this._amqpBroker);

    this._amqp = await conn.createChannel();

    await this._amqp.assertExchange('POLICY', 'topic', { durable: true });

    const policyCreateQ = await this._amqp.assertQueue('policy_storage_q', { exclusive: false });
    await this._amqp.bindQueue(policyCreateQ.queue, 'POLICY', 'policy.create.v1');

    await this._amqp.consume(policyCreateQ.queue, this.onPolicyCreate.bind(this), { noAck: true });
  }

  /**
   * Handle policy creation message
   * @param {{}} message
   * @return {Promise<void>}
   */
  async onPolicyCreate(message) {
    // const { routingKey } = message.fields;
    // const content = message.content.toString();

    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    this._amqp.publish('POLICY', 'policy.creation_success.v1', Buffer.from(JSON.stringify({ policyId: message.properties.correlationId })), {
      correlationId: message.properties.correlationId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });
  }
}

module.exports = DipPolicyStorage;
