/* eslint-disable no-inner-declarations */
require('dotenv').config();


if (require.main === module) {
  // we are on commandline
  module.exports = require('@oclif/command');
} else {
  // we are an imported module
  const Gif = require('./lib/Gif');
  const {
    GIF_API_HOST, GIF_API_PORT,
  } = process.env;

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
  async function connect() {
    const apiUri = getApiUri();
    console.log(`Connected with GIF API at ${apiUri}`);
    const gif = new Gif(apiUri, errorHandler);
    return gif.commands;
  }

  module.exports = { connect };
}
