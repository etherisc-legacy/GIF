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
 * DIP Fiat Payment Gateway microservice
 */
class DipFiatPaymentGateway {
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

    const q = await this._amqp.assertQueue('payments_gateway', { exclusive: false });
    await this._amqp.bindQueue(q.queue, shared.exhanges.policy, 'policy.charge_card.v1');

    await this._amqp.consume(q.queue, this.chargeCard.bind(this), { noAck: true });
  }

  /**
   * Handle card charding message
   * @param {{}} message
   * @return {Promise<void>}
   */
  async chargeCard(message) {
    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    this._amqp.publish(shared.exhanges.policy, 'policy.card_charged.v1', Buffer.from(JSON.stringify({ policyId: message.properties.correlationId })), {
      correlationId: message.properties.correlationId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });
  }
}

module.exports = DipFiatPaymentGateway;
