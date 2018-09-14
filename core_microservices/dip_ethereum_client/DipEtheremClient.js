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


class DipEtheremClient {
  constructor({ amqpBroker }) {
    this._amqpBroker = amqpBroker;
    this._amqp = null;
  }

  async listen() {
    const conn = await amqp.connect(this._amqpBroker);

    this._amqp = await conn.createChannel();

    await this._amqp.assertExchange(shared.exhanges.policy, 'topic', { durable: true });

    const q = await this._amqp.assertQueue('success_policies', { exclusive: false });
    await this._amqp.bindQueue(q.queue, shared.exhanges.policy, `${shared.topic.policyCreationSuccess}.v1`);

    await this._amqp.consume(q.queue, this.createTransaction.bind(this), { noAck: true });
  }

  async createTransaction(message) {
    // const { routingKey } = message.fields;
    // const content = message.content.toString();

    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    this._amqp.publish(shared.exhanges.policy, 'policy.transaction_created.v1', Buffer.from(JSON.stringify({ policyId: message.properties.correlationId})), {
      correlationId: message.properties.correlationId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });

    // Todo: implement
    await new Promise(resolve => setTimeout(resolve, 1000));

    this._amqp.publish(shared.exhanges.policy, 'policy.state_changed.v1', Buffer.from(JSON.stringify({ policyId: message.properties.correlationId, state: 0})), {
      correlationId: message.properties.correlationId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    this._amqp.publish(shared.exhanges.policy, 'policy.state_changed.v1', Buffer.from(JSON.stringify({ policyId: message.properties.correlationId, state: 1})), {
      correlationId: message.properties.correlationId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 10000));

    this._amqp.publish(shared.exhanges.policy, 'policy.state_changed.v1', Buffer.from(JSON.stringify({ policyId: message.properties.correlationId, state: 3})), {
      correlationId: message.properties.correlationId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });
  }
}

module.exports = DipEtheremClient;
