const dotenv = require('dotenv');
const EventEmitter = require('events');
const FlightStatsClient = require('./flightstats/flightStatsClient');
const registerRoutes = require('./routes');
const services = require('./services');
const models = require('./models/module');


/** */
class FddApi {
  /**
   * @param {{}} DI
   */
  constructor({
    amqp,
    router,
    genericInsurance,
    db,
    log,
  }) {
    this._amqp = amqp;
    this._log = log;
    this._messageBus = new EventEmitter();
    this._models = models(db);
    const config = dotenv.load().parsed;
    const flightStatsClient = new FlightStatsClient({ ...config });
    const servicesDeps = services({ config, flightStatsClient, log });
    registerRoutes({
      config,
      amqp,
      router,
      genericInsurance,
      log,
      messageBus: this._messageBus,
      db: this._models,
      ...servicesDeps,
    });
  }

  /**
   * Bootstrap application
   * @return {void}
   */
  async bootstrap() {
    await this._amqp.consume({
      messageType: 'stateChanged',
      messageVersion: '1.*',
      handler: this.onStateChanged.bind(this),
    });
    await this._amqp.consume({
      messageType: 'certificateIssued',
      messageVersion: '1.*',
      handler: this.onCertificateIssued.bind(this),
    });
    await this._amqp.consume({
      messageType: 'policyCreationError',
      messageVersion: '1.*',
      handler: this.onPolicyCreationError.bind(this),
    });
    await this._amqp.consume({
      messageType: 'policyCreationSuccess',
      messageVersion: '1.*',
      handler: this.onPolicyCreationSuccess.bind(this),
    });
    await this._amqp.consume({
      messageType: 'policyGetResponse',
      messageVersion: '1.*',
      handler: this.policyGetResponse.bind(this),
    });
  }

  /**
   * On policy state changed
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  onStateChanged({ content, fields, properties }) {
    this._log.info('stateChanged', content);
    this._messageBus.emit('stateChanged', content, fields, properties);
  }

  /**
   * On certificate issued
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  onCertificateIssued({ content, fields, properties }) {
    this._log.info('certificateIssued', content);
    this._messageBus.emit('certificateIssued', content, fields, properties);
  }

  /**
   * On policy creation error
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  onPolicyCreationError({ content, fields, properties }) {
    this._log.info('policyCreationError', content);
    this._messageBus.emit('policyCreationError', content, fields, properties);
  }

  /**
   * On policy creation success
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  onPolicyCreationSuccess({ content, fields, properties }) {
    this._log.info('policyCreationSuccess', content);
    this._messageBus.emit('policyCreationSuccess', content, fields, properties);
  }

  /**
   * get policy response
   * @param {{}} content
   * @param {{}} fields
   * @param {{}} properties
   */
  policyGetResponse({ content, fields, properties }) {
    this._log.info('policyGetResponse', content);
    this._messageBus.emit('policyGetResponse', content, fields, properties);
  }
}

module.exports = FddApi;
