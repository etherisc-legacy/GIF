/* eslint-disable no-console */

const EventEmitter = require('events');
const _ = require('lodash');
const chalk = require('chalk');
const columnify = require('columnify');
const axios = require('axios');
const fs = require('fs-jetpack');
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
   * @param{{}} obj
   * @param{{}} cond
   * @returns {*}
   */
  objectFind(obj, cond) {
    return Object.keys(obj).map(item => obj[item]).find(cond);
  }

  /**
   *
   * @param{{}} artifact
   * @returns {*}
   */
  getVersion(artifact) {
    const { contractName, ast } = artifact;
    const { nodes } = ast;
    const main = this.objectFind(nodes, item => item.name === contractName);
    const versionNode = this.objectFind(main.nodes, item => item.name === 'VERSION');
    if (!versionNode) {
      this.errorHandler('Contract has no VERSION field');
    }
    return versionNode.value.value;
  }

  /**
   *
   * @param{string} file
   * @param{string} network
   * @param{number} networkId
   * @param{string} product
   * @returns {Promise<void>}
   */
  async sendArtifact(file, network, networkId, product) {
    const artifactContent = fs.read(file, 'utf8');
    const artifactJSON = JSON.parse(artifactContent);
    const artifact = {
      contractName: artifactJSON.contractName,
      abi: artifactJSON.abi,
      networks: artifactJSON.networks,
      compiler: artifactJSON.compiler,
      updatedAt: artifactJSON.updatedAt,
    };
    const version = this.getVersion(artifactJSON);
    const deployment = artifact.networks[networkId];
    if (!deployment) {
      this.error(this.errorMessages.noDeployment);
    }
    this.log(`Sending ${artifact.contractName} to ${network}, networkId=${networkId}, version ${version}`);
    const response = await this.api.sendArtifact({
      product,
      network,
      networkId,
      artifact: JSON.stringify(artifact),
      version,
    });

    if (response.error) {
      console.log(response);
      this.error(response.error);
    } else {
      this.log(JSON.stringify(response.data));
    }
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
    return response.data;
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
