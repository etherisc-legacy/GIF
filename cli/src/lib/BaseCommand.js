const updateNotifier = require('update-notifier');
const { Command } = require('@oclif/command');
const { cli } = require('cli-ux');
const moment = require('moment');
const Amqp = require('@etherisc/amqp');
const Gif = require('./Gif');
const Api = require('./Api');
const eth = require('./eth');
const GlobalConfig = require('./GlobalConfig');
const errorMessages = require('./errorMessages');


/**
 * Base command
 */
class BaseCommand extends Command {
  /**
   * Provides cli ux
   * @return {*}
   */
  get cli() {
    return cli;
  }

  /**
   * Initialization
   * @return {Promise<void>}
   */
  async init() {
    // Check latest version
    const pkg = require(`${this.config.root}/package.json`);
    updateNotifier({
      pkg,
      updateCheckInterval: 0,
    }).notify();

    const {
      GIF_API_HOST, GIF_API_PORT,
      GIF_AMQP_HOST, GIF_AMQP_PORT,
    } = process.env;

    // Initialize and configure API
    const apiUri = `${GIF_API_HOST || 'http://api.sandbox.etherisc.com'}:${GIF_API_PORT || 4001}`;
    this.api = new Api(apiUri);

    this.globalConfig = new GlobalConfig();

    if (this.globalConfig.token) {
      this.api.setAuthToken(this.globalConfig.token);
    }

    // Eth
    this.eth = eth;

    // Initialize and configure AMQP and Gif
    const { configuration } = this.globalConfig;
    if (configuration && configuration.current) {
      const { username, password } = this.globalConfig.credentials;

      const config = {
        mode: 'product',
        username,
        password,
        host: GIF_AMQP_HOST || 'amqp.sandbox.etherisc.com',
        port: GIF_AMQP_PORT || 5672,
      };

      const amqp = new Amqp(config, username, this.config.version);

      const info = {
        product: username,
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
    if (this.gif && this.gif._connected) {
      await this.gif.shutdown();
    }
  }
}

module.exports = BaseCommand;
