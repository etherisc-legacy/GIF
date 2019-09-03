const amqplib = require('amqplib');
const messageProcessor = require('./messages');

/**
 * RabbitMQ client
 */
class Amqp {
  /**
   * Constructor
   * @param {{}} connectionConfig
   * @param {string} appName
   * @param {string} appVersion
   */
  constructor(connectionConfig, appName, appVersion) {
    this.connectionConfig = connectionConfig;

    this.appName = appName;
    this.appVersion = appVersion;
    this.exchangeName = 'EXCHANGE';

    this._publish_connection = null;
    this._consume_connection = null;

    this._publish_channel = null;
    this._consume_channel = null;

    this.shutdown = this.shutdown.bind(this);
  }

  /**
   * Get connection to broker
   * @return {null}
   */
  get publishConnection() {
    return this._publish_connection;
  }

  /**
   * Get connection to broker
   * @return {null}
   */
  get consumeConnection() {
    return this._consume_connection;
  }

  /**
   * Get channel to broker connection to consume messages
   * @return {null}
   */
  get consumeChannel() {
    return this._consume_channel;
  }

  /**
   * Get channel to broker connections to publish messages
   * @return {null}
   */
  get publishChannel() {
    return this._publish_channel;
  }

  /**
   * Close connection with broker
   */
  closeConnections() {
    if (this._publish_connection) this._publish_connection.close();
    if (this._consume_connection) this._consume_connection.close();
  }

  /**
   * Close channel
   */
  closeChannels() {
    if (this._publish_channel) {
      this._publish_channel.close();
      this._publish_channel = null;
    }
    if (this._consume_channel) {
      this._consume_channel.close();
      this._consume_channel = null;
    }
  }

  /**
   * Connect to RabbitMQ broker
   * @return {*}
   */
  async createConnections() {
    if (this._publish_connection) {
      this._publish_connection.close();
    }

    if (this._consume_connection) {
      this._consume_connection.close();
    }

    const {
      mode, username, password, host, port,
    } = this.connectionConfig;
    // TODO: Simplify this
    const connectionString = `amqp://${username}:${password}@${host}:${port}`;
    switch (mode) {
      case 'product':
        this._consume_connection = await amqplib.connect(`${connectionString}/trusted`);
        this._publish_connection = await amqplib.connect(`${connectionString}/public`);
        break;
      case 'license':
        this._consume_connection = await amqplib.connect(`${connectionString}/public`);
        this._publish_connection = await amqplib.connect(`${connectionString}/trusted`);
        break;
      case 'core':
        this._consume_connection = await amqplib.connect(`${connectionString}/trusted`);
        this._publish_connection = this._consume_connection;
        break;
      default:
        throw new Error('Unknown AMQP mode');
    }

    return null;
  }

  /**
   * Create new channel
   * @return {Promise<null>}
   */
  async createChannels() {
    if (!this._publish_connection) throw new Error('Amqp publish connection does\'n exists');
    if (!this._consume_connection) throw new Error('Amqp consume connection does\'n exists');

    if (!this._consume_channel) {
      this._consume_channel = await this._consume_connection.createChannel();
    }

    if (!this._publish_channel && this._publish_connection !== this._consume_connection) {
      this._publish_channel = await this._publish_connection.createChannel();
    } else {
      this._publish_channel = this._consume_channel;
    }

    return null;
  }

  /**
   * Start module
   * @return {Promise<void>}
   */
  async bootstrap() {
    await this.createConnections();
    await this.createChannels();
  }

  /**
   * Shutdown module
   */
  shutdown() {
    this.closeChannels();
    this.closeConnections();
  }

  /**
   * Start listening to queue messages
   * @param {{}} params
   * @param {string} [params.product = '*']
   * @param {string} [params.sourceMicroservice = '*']
   * @param {string} [params.messageType = '*']
   * @param {string} [params.messageTypeVersion = '*.*']
   * @param {function} params.handler
   * @return {Promise<void>}
   */
  async consume({
    product = '*',
    sourceMicroservice = '*',
    messageType = '*',
    messageTypeVersion = '*.*',
    handler,
  }) {
    const channel = this.consumeChannel;

    if (!channel) throw new Error('Amqp channel doesn\'t exist');

    const queueName = [
      product,
      this.connectionConfig.username,
      this.appName,
      this.appVersion,
      sourceMicroservice,
      messageType,
      messageTypeVersion,
    ].join('_');

    const topic = [
      product,
      sourceMicroservice,
      messageType,
      messageTypeVersion,
    ].join('.');

    await channel.assertQueue(queueName, { exclusive: false, durable: true });
    await channel.bindQueue(queueName, this.exchangeName, topic);

    const messageHandler = this.handleMessage({ messageType, messageTypeVersion, handler }).bind(this);
    await channel.consume(queueName, messageHandler, { noAck: false });
  }

  /**
   * Preprocess queue message and pass it to specified handler
   * @param {{}} params
   * @param {string} [params.messageType = '*']
   * @param {string} [params.messageTypeVersion = '*.*']
   * @param {Function} params.handler
   * @return {function}
   */
  handleMessage({ messageType = '*', messageTypeVersion = '*.*', handler }) {
    const channel = this.consumeChannel;

    return async (message) => {
      const { fields, properties } = message;
      let content;
      let result;

      try {
        if (messageType === '*') {
          content = JSON.parse(message.content.toString());
        } else {
          content = messageProcessor.unpack(message.content, messageType, messageTypeVersion);
        }
      } catch (error) {
        channel.nack(message, false, false); // Reject the message without redelivery if it fails to be parsed
        throw error;
      }

      try {
        result = await handler({
          content,
          fields,
          properties,
        });
      } catch (error) {
        const shouldBeRedelivered = false; // TODO: come up with redelivery strategy/options ?
        channel.nack(message, false, shouldBeRedelivered);
        throw error;
      }

      channel.ack(message);

      return result;
    };
  }

  /**
   * Publish message to queue
   * @param {{}} params
   * @param {string} [params.product = this.connectionConfig.username]
   * @param {string} params.messageType
   * @param {string} [params.messageTypeVersion = 'latest']
   * @param {{}} params.content
   * @param {string} params.correlationId
   * @param {{}} params.customHeaders
   * @return {Promise<void>}
   */
  async publish({
    product = this.connectionConfig.username,
    messageType,
    messageTypeVersion = 'latest',
    content,
    correlationId,
    customHeaders,
  }) {
    const channel = this.publishChannel;

    if (!channel) throw new Error('Amqp publish channel doesn\'t exist');
    // await channel.assertExchange(this.exchangeName, 'topic', { durable: true });
    // TODO: check Exchange existence

    const specificMessageTypeVersion = messageProcessor.findMessageSchema(messageType, messageTypeVersion).version;
    const topic = [
      product,
      this.appName,
      messageType,
      specificMessageTypeVersion,
    ].join('.');

    await channel.publish(
      this.exchangeName,
      topic,
      messageProcessor.pack(content, messageType, specificMessageTypeVersion),
      {
        ...{ userId: this.connectionConfig.username }, // impersonation will fail with 406 (PRECONDITION-FAILED)
        ...messageProcessor.headers(
          correlationId, customHeaders, this.appName, this.appVersion, messageType, specificMessageTypeVersion,
        ),
      },
    );
  }
}

module.exports = Amqp;
