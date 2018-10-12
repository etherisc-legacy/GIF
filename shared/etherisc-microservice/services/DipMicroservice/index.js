const Router = require('koa-router');
const { throwError } = require('../../utils');

/**
 * Base DIP microservice wrapper
 */
class DipMicroservice {
  /**
   * Constructor
   * @param {class} App
   * @param {ioModule} ioDeps
   */
  constructor(App, ioDeps) {
    this.App = App;

    this.appName = ioDeps.appName;
    this.appVersion = ioDeps.appVersion;
    this.amqp = ioDeps.amqp;
    this.db = ioDeps.db;
    this.http = ioDeps.http;
    this.log = ioDeps.log;
    this.config = ioDeps.config;
  }

  /**
   * Start application
   * @return {Promise<void>}
   */
  async bootstrap() {
    try {
      await this.amqp.bootstrap();
      await this.db.bootstrap();

      const applicationRouter = new Router();

      this.app = new this.App({
        amqp: this.amqp,
        db: this.db.getConnection(),
        http: this.http,
        log: this.log,
        config: this.config,
        router: applicationRouter,
      });

      await this.http.bootstrap(applicationRouter);

      await this.app.bootstrap();

      this.http.setReadyStatus(true);

      this.log.info(`${this.appName}.v${this.appVersion} started`);

      ['SIGTERM', 'SIGHUP', 'SIGINT'].forEach((signal) => {
        process.on(signal, () => {
          this.log.debug(`${signal} received, shutdown ${this.appName}.v${this.appVersion} microservice`);

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

    process.exit();
  }
}

module.exports = DipMicroservice;
