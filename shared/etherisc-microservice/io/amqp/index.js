const amqplib = require('amqplib');
const uuid = require('uuid/v1');


/**
 * RabbitMQ client
 */
class Amqp {
  /**
   * Constructor
   * @param {string} connectionString
   * @param {string} appName
   * @param {string} appVersion
   */
  constructor(connectionString, appName, appVersion) {
    this.connectionString = connectionString;
    this.appName = appName;
    this.appVersion = appVersion;

    this._connection = null;
    this._channel = null;
  }

  /**
   * Get connection to broker
   * @return {null}
   */
  get connection() {
    return this._connection;
  }

  /**
   * Get channel to broker connection
   * @return {null}
   */
  get channel() {
    return this._channel;
  }

  /**
   * Close connection with broker
   */
  closeConnection() {
    if (this._connection) this.connection.close();
  }

  /**
   * Close channel
   */
  closeChannel() {
    if (this._channel) this.channel.close();
  }

  /**
   * Generate unique name for new queue
   * @return {string}
   */
  generateUniqueQueueName() {
    return `${this.appName}_${this.appVersion}_${uuid()}`;
  }

  /**
   * Connect to RabbitMQ broker
   * @return {*}
   */
  async createConnection() {
    if (this._connection) {
      this._connection.close();
    }

    this._connection = await amqplib.connect(this.connectionString);

    return this._connection;
  }

  /**
   * Create new channel
   * @return {Promise<null>}
   */
  async createChannel() {
    if (!this._connection) throw new Error('Amqp connection does\'n exists');
    if (this._channel) {
      return this._channel;
    }

    this._channel = await this._connection.createChannel();

    return this._channel;
  }

  /**
   * Start module
   * @return {Promise<void>}
   */
  async bootstrap() {
    await this.createConnection();
    await this.createChannel();
  }

  /**
   * Shutdown module
   */
  shutdown() {
    this.closeChannel();
    this.closeConnection();
  }

  /**
   * Start listening to queue messages
   * @param {string} exhange
   * @param {string} topic
   * @param {function} handler
   * @return {Promise<void>}
   */
  async consume(exhange, topic, handler) {
    if (!this._channel) throw new Error('Amqp channel does\'n exists');

    await this._channel.assertExchange(exhange, 'topic', { durable: true });

    const queueName = this.generateUniqueQueueName();

    const queue = await this._channel.assertQueue(queueName, { exclusive: false });
    await this._channel.bindQueue(queue.queue, exhange, topic);

    const messageHandler = this.handleMessage(handler).bind(this);
    await this._channel.consume(queue.queue, messageHandler, { noAck: true });
  }

  /**
   * Preprocess queue message and pass it to specified handler
   * @param {function} handler
   * @return {function(*): *}
   */
  handleMessage(handler) {
    return (message) => {
      const { routingKey } = message.fields;
      const content = message.content.toString();
      const { correlationId } = message.properties;

      return handler({
        content,
        routingKey,
        correlationId,
      });
    };
  }

  /**
   *
   * @param {string} exchange
   * @param {string} topic
   * @param {{}} message
   * @param {string} correlationId
   * @return {Promise<void>}
   */
  async publish(exchange, topic, message, correlationId) {
    if (!this._channel) throw new Error('Amqp channel does\'n exists');

    await this._channel.assertExchange(exchange, 'topic', { durable: true });

    this._channel.publish(exchange, topic, Buffer.from(JSON.stringify(message)), {
      correlationId,
      headers: {
        originatorName: this.appName,
        originatorVersion: this.appVersion,
      },
    });
  }
}

module.exports = Amqp;
