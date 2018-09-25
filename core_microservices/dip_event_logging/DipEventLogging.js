const { Pool } = require('pg');
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
 * DIP Event Logging microservice
 */
class DipEventLogging {
  /**
   * Constructor
   * @param {string} amqpBroker
   * @param {string} pgConnectionString
   */
  constructor({ amqpBroker, pgConnectionString }) {
    this._pool = new Pool({
      connectionString: pgConnectionString,
    });
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

    const q = await this._amqp.assertQueue('', { exclusive: false });
    await this._amqp.bindQueue(q.queue, shared.exhanges.policy, '#');

    await this._amqp.consume(q.queue, async (message) => {
      await this._pool.query({
        text: 'INSERT INTO dip_event_logging(properties, fields, content) VALUES($1, $2, $3)',
        values: [message.properties, message.fields, message.content.toString()],
      });
    }, { noAck: true });
  }
}

module.exports = DipEventLogging;
