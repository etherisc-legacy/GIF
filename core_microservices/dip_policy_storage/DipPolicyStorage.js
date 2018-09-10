class DipPolicyStorage {
  constructor({ amqp, router }) {
    this._amqpBroker = amqp;
    this._router = router;
  }

  async bootstrap() {
    this._router.get('/test', ctx => ctx.body = 'test');

    this._amqp = await this._amqpBroker.connection.createChannel();

    await this._amqp.assertExchange('POLICY', 'topic', { durable: true });

    const policyCreateQ = await this._amqp.assertQueue('policy.create', { exclusive: false });
    await this._amqp.bindQueue(policyCreateQ.queue, 'POLICY', 'policy.create.v1');

    await this._amqp.consume(policyCreateQ.queue, this.onPolicyCreate.bind(this), { noAck: true });
  }

  async onPolicyCreate(message) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    this._amqp.publish('POLICY', 'policy.creation_success.v1', Buffer.from(JSON.stringify({ policyId: message.properties.correlationId})), {
      correlationId: message.properties.correlationId,
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });
  }
}

module.exports = DipPolicyStorage;

