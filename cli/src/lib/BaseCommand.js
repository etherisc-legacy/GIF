const { Command } = require('@oclif/command');
const { cli } = require('cli-ux');
const moment = require('moment');
const os = require('os');
const fs = require('fs-jetpack');
const Amqp = require('@etherisc/amqp');
const Gif = require('./Gif');
const Api = require('./Api');
const eth = require('./eth');
const errorMessages = require('./errorMessages');


/**
 * Base command
 */
class BaseCommand extends Command {
  /**
   * Get config path
   * @return {string}
   */
  get configurationPath() {
    return `${os.homedir()}/.gifconfig.json`;
  }

  /**
   * Get config
   * @return {any}
   */
  get configuration() {
    return fs.read(this.configurationPath, 'json');
  }

  /**
   * Provides cli ux
   * @return {*}
   */
  get cli() {
    return cli;
  }

  /**
   * Write config
   * @param {Object} config
   */
  configure(config) {
    fs.write(this.configurationPath, JSON.stringify(config, ' ', 4));
  }


  /**
   * Initialization
   * @return {Promise<void>}
   */
  async init() {
    const {
      GIF_API_BASE_HOST, GIF_API_PORT,
      GIF_AMQP_HOST, GIF_AMQP_PORT,
    } = process.env;

    // Initialize and configure API
    const apiUri = `${GIF_API_BASE_HOST || 'https://sandbox.etherisc.com'}:${GIF_API_PORT || 4001}`;
    this.api = new Api(apiUri);

    const { configuration } = this;
    if (configuration && configuration.user && configuration.user.token) {
      this.api.setAuthToken(configuration.user.token);
    }

    // Eth
    this.eth = eth;

    // Initialize and configure AMQP and Gif
    if (configuration && configuration.current) {
      if (!configuration.products) throw new Error(errorMessages.invalidConfigurationFormat);

      const product = configuration.products[configuration.current];
      if (!product) throw new Error(errorMessages.invalidConfigurationFormat);

      const { amqpLogin, amqpPassword } = product;

      if (!amqpLogin) throw new Error(errorMessages.noAmqpLogin);
      if (!amqpPassword) throw new Error(errorMessages.noAmqpPassword);

      const config = {
        mode: 'product',
        username: amqpLogin,
        password: amqpPassword,
        host: GIF_AMQP_HOST || 'https://sandbox.etherisc.com',
        port: GIF_AMQP_PORT || '5672',
      };

      const amqp = new Amqp(config, amqpLogin, this.config.version);

      const info = {
        product: configuration.current,
      };

      this.gif = new Gif(amqp, info, this.eth, this.error);
    }

    this.moment = moment;

    this.errorMessages = errorMessages;
  }

  /**
   * Called after run and catch regardless of whether or not the command errored
   * @return {Promise<void>}
   */
  async finally() {
    if (this.gif && this.gif.connected) {
      await this.gif.shutdown();
    }
  }
}

module.exports = BaseCommand;
