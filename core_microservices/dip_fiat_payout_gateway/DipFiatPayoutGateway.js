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


class DipFiatPayoutGateway {
  constructor({ amqpBroker }) {
    this._amqpBroker = amqpBroker;
    this._amqp = null;
  }

  async listen() {
    const conn = await amqp.connect(this._amqpBroker);

    this._amqp = await conn.createChannel();

    await this._amqp.assertExchange(shared.exhanges.policy, 'topic', { durable: true });

    const policyCreateQ = await this._amqp.assertQueue('payout_q', { exclusive: false });
    await this._amqp.bindQueue(policyCreateQ.queue, shared.exhanges.policy, 'policy.payout.v1');

    await this._amqp.consume(policyCreateQ.queue, this.payout.bind(this), { noAck: true });
  }

  async payout(message) {
    // const { routingKey } = message.fields;
    // const content = message.content.toString();

    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    this._amqp.publish(shared.exhanges.policy, 'policy.paid_out.v1', Buffer.from(JSON.stringify({ policyId: message.properties.correlationId})), {
      correlationId: message.properties.correlationId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });
  }
}

module.exports = DipFiatPayoutGateway;
