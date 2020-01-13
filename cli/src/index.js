/* eslint-disable no-inner-declarations */

if (require.main === module) {
  module.exports = require('@oclif/command');
} else {
  const Amqp = require('@etherisc/amqp');
  const GlobalConfig = require('./lib/GlobalConfig');
  const Gif = require('./lib/Gif');
  const eth = require('./lib/eth');

  const { GIF_AMQP_HOST, GIF_AMQP_PORT } = process.env;
  const host = GIF_AMQP_HOST || 'amqp.sandbox.etherisc.com';
  const port = GIF_AMQP_PORT || 5672;
  const mode = 'product';
  const version = '1.0.0';

  /**
   *
   * @param {error} e
   */
  function errorHandler(e) {
    if (e instanceof Error) {
      throw e;
    } else {
      throw new Error(e);
    }
  }

  /**
   *
   * @param {String} username
   * @param {String} password
   * @returns {Promise}
   */
  async function connect(username, password) {
    const connectionConfig = {
      mode, host, port,
    };

    if (!username || !password) {
      const globalConfig = new GlobalConfig();
      const creds = globalConfig.credentials;

      connectionConfig.username = creds.username;
      connectionConfig.password = creds.password;
    } else {
      connectionConfig.username = username;
      connectionConfig.password = password;
    }

    const amqp = new Amqp(connectionConfig, username, version);

    const info = { product: connectionConfig.username };
    const gif = new Gif(amqp, info, eth, errorHandler);

    await gif.connect();
    await gif.usePersistantChannels();

    return gif.commands;
  }

  module.exports = { connect };
}
