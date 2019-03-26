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
      API_BASE_URI,
      AMQP_HOST, AMQP_PORT,
    } = process.env;

    // Initialize and configure API
    this.api = new Api(API_BASE_URI || 'http://localhost:4001');

    const { configuration } = this;
    if (configuration && configuration.user && configuration.user.token) {
      this.api.setAuthToken(configuration.user.token);
    }

    // Eth
    this.eth = eth;

    // Initialize and configure AMQP and Gif
    if (configuration && configuration.current) {
      if (!configuration.products) throw new Error('Invalid configuration format');

      const product = configuration.products[configuration.current];
      if (!product) throw new Error('Invalid configuration format');

      const { amqpLogin, amqpPassword } = product;

      if (!amqpLogin) throw new Error('Invalid configuration: AMQP login not provided');
      if (!amqpPassword) throw new Error('Invalid configuration: AMQP password not provided');

      const config = {
        mode: 'product',
        username: amqpLogin,
        password: amqpPassword,
        host: AMQP_HOST || 'localhost',
        port: AMQP_PORT || '5672',
      };

      const amqp = new Amqp(config, amqpLogin, this.config.version);
      await amqp.createConnections();

      const info = {
        product: configuration.current,
      };

      const gif = new Gif(amqp, info, this.eth);
      this.gif = gif.cli;
    }

    this.moment = moment;

    this.errorMessages = errorMessages;
  }

  /**
   * Called after run and catch regardless of whether or not the command errored
   * @return {Promise<void>}
   */
  async finally() {
    if (this.gif) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await this.gif.shutdown();
    }
  }
}

module.exports = BaseCommand;
