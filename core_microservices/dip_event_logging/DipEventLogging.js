const { Pool } = require('pg');
const amqp = require('amqplib');


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

    await this._amqp.assertExchange('POLICY', 'topic', { durable: true });

    const q = await this._amqp.assertQueue('dip_event_logging', { exclusive: false });
    await this._amqp.bindQueue(q.queue, 'POLICY', '#');

    await this._amqp.consume(q.queue, this.save.bind(this), { noAck: true });
  }

  /**
   * Save message
   * @param {object} message
   * @return {Promise<void>}
   */
  save(message) {
    return this._pool.query({
      text: 'INSERT INTO dip_event_logging(properties, fields, content) VALUES($1, $2, $3)',
      values: [message.properties, message.fields, message.content.toString()],
    }).catch((e) => {
      console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    });
  }
}

module.exports = DipEventLogging;
