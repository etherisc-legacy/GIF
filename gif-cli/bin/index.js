/* eslint-disable no-inner-declarations */
require('dotenv').config();


if (require.main === module) {
  // we are on commandline
  module.exports = require('@oclif/command');
} else {
  // we are an imported module
  const Amqp = require('@etherisc/amqp');
  const GlobalConfig = require('./lib/GlobalConfig');
  const Gif = require('./lib/Gif');
  const {
    GIF_AMQP_HOST, GIF_AMQP_PORT, GIF_API_HOST, GIF_API_PORT,
  } = process.env;
  const host = GIF_AMQP_HOST || 'amqp-sandbox.etherisc.com';
  const port = GIF_AMQP_PORT || 5673;
  const mode = 'product';
  const version = '1.0.0';

  /**
   *
   * @returns {string}
   */
  function getApiUri() {
    // Initialize and configure API
    const apiHost = GIF_API_HOST
      ? (GIF_API_HOST.startsWith('http://') || GIF_API_HOST.startsWith('https://')
        ? GIF_API_HOST
        : `http://${GIF_API_HOST}`)
      : 'https://api-sandbox.etherisc.com';
    const apiPort = GIF_API_PORT
      ? `:${GIF_API_PORT}`
      : '';
    return `${apiHost}${apiPort}`;
  }


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
    const apiUri = getApiUri();
    const info = { product: connectionConfig.username };
    const gif = new Gif(amqp, apiUri, info, errorHandler);

    await gif.connect();
    await gif.usePersistantChannels();

    return gif.commands;
  }

  module.exports = { connect };
}
