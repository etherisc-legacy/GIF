const Koa = require('koa');
const Logger = require('koa-logger');
const Cors = require('kcors');
const BodyParser = require('koa-bodyparser');
const Respond = require('koa-respond');
const prometheus = require('@echo-health/koa-prometheus-exporter');
const exceptionHandler = require('./exceptionHandler');
const router = require('./router');
const K8sController = require('./controllers/k8sController');

/**
 * Http server
 */
class HttpApp extends Koa {
  /**
   * Constructor
   * @param {number} port
   */
  constructor(port) {
    super();

    this._server = null;

    this._port = port;

    this._controllers = {};
  }

  /**
   * Get instance of server
   * @return {null|*}
   */
  get server() {
    return this._server;
  }

  /**
   * Get server port
   * @return {number}
   */
  get port() {
    return this._port;
  }

  /**
   * Shutdown http server
   */
  shutdown() {
    if (this._server) {
      this._server.close();
    }
  }

  /**
   * Set application readyness status
   * @param {boolean} status
   */
  setReadyStatus(status) {
    const { k8sController } = this._controllers;

    if (!k8sController) {
      throw new Error({
        message: 'k8sController does not exists',
        exit: 1,
      });
    }

    k8sController.setReadyStatus(status);
  }

  /**
   * Get application shutdown status
   * @return {boolean}
   */
  getShuttingDownStatus() {
    const { k8sController } = this._controllers;

    if (!k8sController) {
      throw new Error({
        message: 'k8sController does not exists',
        exit: 1,
      });
    }

    return k8sController.shuttingDownStatus;
  }

  /**
   * Set application shutdown status
   * @param {boolean} status
   */
  setShuttingDownStatus(status) {
    const { k8sController } = this._controllers;

    if (!k8sController) {
      throw new Error({
        message: 'k8sController does not exists',
        exit: 1,
      });
    }

    k8sController.setShuttingDownStatus(status);
  }

  /**
   * Start http server
   * @param {Router} appRouter
   * @return {Promise}
   */
  bootstrap(appRouter) {
    this._controllers.k8sController = new K8sController();
    const coreRouter = router(this._controllers);

    this
      .use(exceptionHandler)
      .use(new Logger())
      .use(new Cors())
      .use(new BodyParser())
      .use(new Respond())
      .use(appRouter.routes())
      .use(coreRouter.routes())
      .use(prometheus.httpMetricMiddleware())
      .use(prometheus.middleware({}));

    return new Promise((resolve, reject) => {
      this._server = this.listen(this._port, (err) => {
        if (err) {
          reject(new Error(err));
          return;
        }

        resolve({
          host: 'http://localhost',
          port: this._port,
        });
      });
    });
  }
}

module.exports = HttpApp;
