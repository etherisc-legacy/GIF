const models = require('./models');

/**
 * License Manager microservice
 */
class LicenseManager {
  /**
     * Constructor
     * @param {object} amqp
     * @param {object} config
     * @param {object} log
     * @param {object} db
     */
  constructor({
    amqp, config, log, db,
  }) {
    this.amqp = amqp;
    this.config = config;
    this.log = log;
    this.db = db;
    this.models = models(db);
  }

  /**
     * Log message
     * @param {{}} params
     * @param {{}} params.fields
     * @param {{}} params.properties
     * @return {void}
     * */
  logMessage({
    fields, properties,
  }) {
    this.log.info(`[MESSAGE] ${fields.routingKey}: properties: ${JSON.stringify(properties)}`);
  }

  /**
     * Validate message
     * @param {{}} params
     * @param {{}} params.content
     * @param {{}} params.fields
     * @param {{}} params.properties
     * @return {boolean}
     * */
  async validateMessage({
    content, fields, properties,
  }) {
    const { Product } = this.models;
    const [productCount] = await Product.query().where('name', properties.userId).count();

    // TODO: Optionally check for specific message-type permissions on the product
    // TODO: Check for throttling metrics or the uniqueness of the message

    return (productCount.count > 0);
  }

  /**
     * Forward message to trusted queue
     * @param {{}} params
     * @param {{}} params.content
     * @param {{}} params.fields
     * @param {{}} params.properties
     * @return {void}
     * */
  forwardMessage({
    content, fields, properties,
  }) {
    // TODO: Optionally filter content out

    this.amqp.publish({
      messageType: properties.headers.messageType,
      messageTypeVersion: properties.headers.messageTypeVersion,
      content,
      correlationId: properties.correlationId,
      customHeaders: {
        product: properties.userId,
      },
    });
  }


  /**
     * Start application
     * @return {Promise<void>}
     */
  async bootstrap() {
    this.amqp.consume({
      messageType: '*',
      messagetypeVersion: '#',
      handler: async ({ content, fields, properties }) => {
        this.logMessage({ fields, properties });

        if (await this.validateMessage({ content, fields, properties })) {
          this.forwardMessage({ content, fields, properties });
        } else {
          this.log.error('Message not cleared for trusted queue.');
        }
      },
    });
  }
}

module.exports = LicenseManager;
