/* eslint-disable no-console */

const EventEmitter = require('events');
const _ = require('lodash');
const chalk = require('chalk');
const columnify = require('columnify');
const axios = require('axios');
const docs = require('./docs');


/**
 * GIF client
 */
class Gif extends EventEmitter {
  /**
   * Constructor
   * @param {string} apiUri
   * @param {Function} errorHandler
   */
  constructor(apiUri, errorHandler) {
    super();

    this._error = errorHandler;
    this._consumers = {};
    this.api = axios.create({
      baseURL: apiUri,
    });
  }

  /**
   *
   * @param{string} label
   * @param{string} msg
   */
  log(label, msg) {
    console.log(chalk` {green   > ${msg ? label : 'Info'}:} ${msg || label}`);
  }

  /**
   * CLI
   * @return {Object}
   */
  get commands() {
    return {
      help: this.help.bind(this),
      artifact: {
        get: this.getArtifact.bind(this),
      },
      contract: {
        call: this.callContract.bind(this),
      },
    };
  }

  /**
   * Get information about commad
   * @param {String} cmd
   * @return {void}
   */
  help(cmd) {
    if (!cmd) {
      const commands = _.map(_.keys(docs), el => [chalk.blue(el), docs[el].annotation]);
      console.log(columnify(commands, { showHeaders: false }));
      return;
    }

    if (!docs[cmd]) {
      console.error(`No documentation for ${cmd}`);
      return;
    }

    console.log('     ', chalk.blue(docs[cmd].annotation));
    if (docs[cmd].details) {
      console.log(docs[cmd].details);
    }
  }

  /* Events section */

  /**
   *
   * @param{string} product
   * @param{string} networkName
   * @param{string} contractName
   * @returns {Promise<any>}
   */
  async getArtifact(product, networkName, contractName) {
    const response = await this.api.get('/api/artifact/get', {
      data: {
        product,
        networkName,
        contractName,
      },
    });

    if (response.error) {
      this.error(response.error);
    }
    return JSON.parse(JSON.parse(response.abi));
  }

  /**
   * Call contract request
   * @param {String} product
   * @param {String} contractName
   * @param {String} methodName
   * @param {Array} parameters
   * @return {Promise<*>}
   */
  async callContract({
    product, contractName, methodName, parameters,
  }) {
    if (!product || !contractName || !methodName || !parameters) {
      return this.wrongArgument('gif.contract.call');
    }

    const response = await this.api.get('/api/contract/call', {
      data: {
        product,
        contractName,
        methodName,
        parameters,
      },
    });

    return response;
  }

  /**
   * Handle error
   * @param {Error} e
   * @return {{error: String}}
   */
  errorHandler(e) {
    return { error: e.message || e.error || e };
  }

  /**
   * Wrong argument error handler
   * @param {String} cmd
   * @return {{error: String}}
   */
  wrongArgument(cmd) {
    this.cli.help(cmd);
    return this.errorHandler(new Error('Wrong arguments'));
  }
}

module.exports = Gif;
