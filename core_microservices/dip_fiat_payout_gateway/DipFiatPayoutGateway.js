const amqp = require('amqplib');


const shared = {
  exhanges: {
    policy: 'POLICY',
  },
  queues: {
    policyLog: 'policy.log',
    policyCreate: 'policy.create',
  },
  topic: {
    policyCreate: 'policy.create',
    policyCreationSuccess: 'policy.creation_success',
  },
};

/**
 * DIP Fiat Payout Gateway microservice
 */
class DipFiatPayoutGateway {
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

    await this._amqp.assertExchange(shared.exhanges.policy, 'topic', { durable: true });

    const policyCreateQ = await this._amqp.assertQueue('payout_q', { exclusive: false });
    await this._amqp.bindQueue(policyCreateQ.queue, shared.exhanges.policy, 'policy.payout.v1');

    await this._amqp.consume(policyCreateQ.queue, this.payout.bind(this), { noAck: true });
  }

  /**
   * Handle payout event message
   * @param {{}} message
   * @return {Promise<void>}
   */
  async payout(message) {
    // const { routingKey } = message.fields;
    // const content = message.content.toString();

    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    this._amqp.publish(shared.exhanges.policy, 'policy.paid_out.v1', Buffer.from(JSON.stringify({ policyId: message.properties.correlationId })), {
      correlationId: message.properties.correlationId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });
  }
}

module.exports = DipFiatPayoutGateway;
