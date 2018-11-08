const amqplib = require('amqplib');
const messageProcessor = require('./messages');

/**
 * RabbitMQ client
 */
class Amqp {
  /**
   * Constructor
   * @param {string} connectionString
   * @param {string} appName
   * @param {string} appVersion
   * @param {string} exchangeName
   */
  constructor(connectionString, appName, appVersion, exchangeName) {
    this.connectionString = connectionString;

    this.appName = appName;
    this.appVersion = appVersion;
    this.exchangeName = exchangeName;

    this.exchangeName = 'POLICY';
    // TODO: use an universal exchange for all 'topic' platform messages or make an exchanges list

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
   * @param {string} [sourceMicroservice = '*']
   * @param {string} [messageType = '*']
   * @param {string} [messageTypeVersion = '*.*']
   * @param {function} handler
   * @return {Promise<void>}
   */
  async consume({
    sourceMicroservice = '*', messageType = '*', messageTypeVersion = '*.*', handler,
  }) {
    if (!this._channel) throw new Error('Amqp channel doesn\'t exist');
    await this._channel.assertExchange(this.exchangeName, 'topic', { durable: true });

    const queueName = `${this.appName}_${this.appVersion}_${sourceMicroservice}_${messageType}_${messageTypeVersion}`;
    const topic = `${sourceMicroservice}.${messageType}.${messageTypeVersion}`;

    const queue = await this._channel.assertQueue(queueName, { exclusive: false, durable: true });
    await this._channel.bindQueue(queue.queue, this.exchangeName, topic);

    const messageHandler = this.handleMessage({ messageType, messageTypeVersion, handler }).bind(this);
    await this._channel.consume(queue.queue, messageHandler, { noAck: true });
  }

  /**
   * Preprocess queue message and pass it to specified handler
   * @param {string} [messageType = '*']
   * @param {string} [messageTypeVersion = '*.*']
   * @param {Function} handler
   * @return {Function}
   */
  handleMessage({ messageType = '*', messageTypeVersion = '*.*', handler }) {
    return (message) => {
      const { fields, properties } = message;
      let content;

      if (messageType === '*') {
        content = JSON.parse(message.content.toString());
      } else {
        content = messageProcessor.unpack(message.content, messageType, messageTypeVersion);
      }

      return handler({
        content,
        fields,
        properties,
      });
    };
  }

  /**
   *
   * @param {string} messageType
   * @param {string} [messageTypeVersion = latest]
   * @param {{}} content
   * @param {string} correlationId
   * @param {{}} customHeaders
   * @return {Promise<void>}
   */
  async publish({
    messageType, messageTypeVersion = 'latest', content, correlationId, customHeaders,
  }) {
    if (!this._channel) throw new Error('Amqp channel doesn\'t exist');
    await this._channel.assertExchange(this.exchangeName, 'topic', { durable: true });

    const specificMessageTypeVersion = messageProcessor.findMessageSchema(messageType, messageTypeVersion).version;
    const topic = `${this.appName}.${messageType}.${specificMessageTypeVersion}`;

    await this._channel.publish(this.exchangeName,
      topic,
      messageProcessor.pack(content, messageType, specificMessageTypeVersion),
      messageProcessor.headers(correlationId, customHeaders, this.appName, this.appVersion, messageType));
  }
}

module.exports = Amqp;
