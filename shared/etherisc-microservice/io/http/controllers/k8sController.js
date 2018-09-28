const SERVER_IS_READY = 'SERVER_IS_READY';
const SERVER_IS_NOT_READY = 'SERVER TEMPORARILY UNAVAILABLE';
const SERVER_IS_SHUTTING_DOWN = 'SERVER_IS_SHUTTING_DOWN';
const SERVER_IS_NOT_SHUTTING_DOWN = 'SERVER_IS_LIVE';

/**
 * Routes for Kubernetes
 */
class K8sController {
  /**
   * Constructor
   */
  constructor() {
    this.shuttingDownStatus = false;
    this.readyStatus = false;

    this.ready = this.ready.bind(this);
    this.live = this.live.bind(this);
    this.version = this.version.bind(this);
  }

  /**
   * Set health status
   * @param {boolean} status
   */
  setShuttingDownStatus(status = true) {
    this.shuttingDownStatus = status;
  }

  /**
   * Set ready status
   * @param {boolean} status
   */
  setReadyStatus(status = true) {
    this.readyStatus = status;
  }

  /**
   * Get application health status
   * @param {Context} ctx
   * @return {Promise<void>}
   */
  async health(ctx) {
    let status;
    let message;

    if (this.shuttingDown) {
      status = 500;
      message = SERVER_IS_SHUTTING_DOWN;
    } else if (this.readyStatus) {
      status = 200;
      message = SERVER_IS_READY;
    } else {
      status = 500;
      message = SERVER_IS_NOT_READY;
    }

    ctx.type = 'text/plain';
    ctx.status = status;
    ctx.body = message;
  }


  /**
   * Is service live
   * @param {Context} ctx
   * @return {Promise<void>}
   */
  async live(ctx) {
    let status = 200;
    let message;

    if (this.shuttingDownStatus) {
      status = 500;
      message = SERVER_IS_SHUTTING_DOWN;
    } else {
      status = 200;
      message = SERVER_IS_NOT_SHUTTING_DOWN;
    }

    ctx.type = 'text/plain';
    ctx.status = status;
    ctx.body = message;
  }

  /**
   * Is service ready to accept requests
   * @param {Context} ctx
   * @return {Promise<void>}
   */
  async ready(ctx) {
    let status;
    let message;

    if (this.readyStatus) {
      message = SERVER_IS_READY;
      status = 200;
    } else {
      message = SERVER_IS_NOT_READY;
      status = 500;
    }

    ctx.type = 'text/plain';
    ctx.status = status;
    ctx.body = message;
  }

  /**
   * Get application version
   * @param {Content} ctx
   * @return {Promise<void>}
   */
  async version(ctx) {
    ctx.body = {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
    };
  }
}

module.exports = K8sController;
