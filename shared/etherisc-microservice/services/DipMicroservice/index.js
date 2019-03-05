const Router = require('koa-router');
const { throwError } = require('../../utils');

/**
 * Base DIP microservice wrapper
 */
class DipMicroservice {
  /**
   * Constructor
   * @param {Class} App
   * @param {ioModule} ioDeps
   * @param {{}} services
   */
  constructor(App, ioDeps, services) {
    this.App = App;

    this.amqp = ioDeps.amqp;
    this.db = ioDeps.db;
    this.http = ioDeps.http;
    this.log = ioDeps.log;
    this.config = ioDeps.config;
    this.s3 = ioDeps.s3;
    this.services = services;
    this.websocket = ioDeps.websocket;
  }

  /**
   * Start application
   * @return {Promise<void>}
   */
  async bootstrap() {
    try {
      const deps = {};

      if (this.config.amqp || this.config.genericInsurance) {
        await this.amqp.bootstrap();
        deps.amqp = this.amqp;
      }

      if (this.config.db) {
        await this.db.bootstrap();
        deps.db = this.db.getConnection();
      }

      if (this.config.s3) {
        await this.s3.bootstrap(this.config.bucket);
        deps.s3 = this.s3;
      }

      if (this.config.genericInsurance) {
        const { GenericInsurance } = this.services;
        deps.genericInsurance = new GenericInsurance({ amqp: this.amqp });
      }

      const applicationRouter = new Router();

      await this.http.bootstrap(applicationRouter);

      if (this.config.websocket || this.config.genericInsurance) {
        const websocket = this.websocket(this.http.server);
        await websocket.bootstrap();
        deps.websocket = websocket;
      }

      this.app = new this.App({
        ...deps,
        http: this.http,
        log: this.log,
        config: this.config,
        router: applicationRouter,
        appName: this.config.appName,
        appVersion: this.config.appVersion,
      });

      await this.app.bootstrap();

      this.http.setReadyStatus(true);

      this.log.info(`${this.config.appName}.v${this.config.appVersion} listening on http://localhost:${this.http.port}`);

      ['SIGTERM', 'SIGHUP', 'SIGINT'].forEach((signal) => {
        process.on(signal, () => {
          this.log.debug(`${signal} received, shutdown ${this.config.appName}.v${this.config.appVersion} microservice`);

          this.shutdown();
        });
      });
    } catch (e) {
      throwError(e);
    }
  }


  /**
   * Shutdown application
   */
  shutdown() {
    const status = this.http.getShuttingDownStatus();

    if (status === true) {
      this.log.debug('Server is already shutting down');
      return;
    }

    this.http.setReadyStatus(false);
    this.http.setShuttingDownStatus(true);

    this.amqp.shutdown();
    this.db.shutdown();
    this.http.shutdown();
    this.s3.shutdown();

    process.exit();
  }
}

module.exports = DipMicroservice;
