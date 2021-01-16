const Amqp = require('@etherisc/amqp');
const models = require('./models');
const routes = require('./routes');
const services = require('./services');

/**
 * License Manager microservice
 */
class LicenseManager {
  /**
     * Constructor
     * @param {object} amqp
     * @param {object} http
     * @param {object} router
     * @param {object} config
     * @param {object} log
     * @param {object} db
     */
  constructor({
    amqp, http, router, config, log, db,
  }) {
    this.amqp = amqp;
    this.amqpTrusted = this.amqpTrustedInit({ config, log });
    this.config = config;
    this.log = log;
    this.db = db;
    this.models = models(db);

    const dependencies = {
      config,
      amqp,
      amqpTrusted: this.amqpTrusted,
      log,
      models: this.models,
    };
    const serviceDependencies = services({ ...dependencies });
    routes({ router, ...dependencies, ...serviceDependencies });
  }

  /**
   *
   * @param{{}} config
   * @param{{}} log
   * @returns {*}
   */
  amqpTrustedInit({ config, log }) {
    const {
      appName, appVersion,
    } = config;
    const {
      AMQP_HOST, AMQP_PORT, AMQP_USERNAME, AMQP_PASSWORD,
    } = process.env;

    const messageBrokerConfig = {
      mode: 'core',
      username: AMQP_USERNAME || 'platform',
      password: AMQP_PASSWORD || 'guest',
      host: AMQP_HOST || 'localhost',
      port: AMQP_PORT || '5673',
    };

    const amqp = new Amqp(
      messageBrokerConfig,
      appName,
      appVersion,
    );

    log.info(`Connected in AMQP mode [core] with host ${messageBrokerConfig.host} at port ${messageBrokerConfig.port} appName=${appName} appVersion=${appVersion}`);

    return amqp;
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
    console.log('productCount=', productCount, ' userId=', properties.userId);
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

    const customHeaders = {
      product: properties.userId,
    };

    if (properties.headers.requestId) {
      customHeaders.requestId = properties.headers.requestId;
    }

    this.amqp.publish({
      product: properties.userId,
      messageType: properties.headers.messageType,
      messageTypeVersion: properties.headers.messageTypeVersion,
      content,
      correlationId: properties.correlationId,
      customHeaders,
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
        this.logMessage({ content, fields, properties });

        if (await this.validateMessage({ content, fields, properties })) {
          this.log.info('forwarding...');
          this.forwardMessage({ content, fields, properties });
        } else {
          this.log.error('Message not cleared for trusted queue.');
        }
      },
    });
    await this.amqpTrusted.createConnections();
    await this.amqpTrusted.createChannels();
  }
}

module.exports = LicenseManager;
