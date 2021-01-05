const fs = require('fs-extra');
const uuid = require('uuid/v1');
const EventEmitter = require('events');


const REQUEST_TIMEOUT = 10000;
/**
 * Schedule a timeout with handler.
 * @param {function} cb
 * @returns {object} timeout
 */
const scheduleTimeout = cb => setTimeout(() => cb('Timeout'), REQUEST_TIMEOUT);


/**
 * DIP Artifacts Storage microservice
 */
class Contracts extends EventEmitter {
  /**
   * Constructor
   * @param {object} amqp
   * @param {object} config
   * @param {object} log
   * @param {function} shutdown
   */
  constructor({
    amqp, config, log, shutdown,
  }) {
    super();
    this.amqp = amqp;
    this.config = config;
    this.log = log;
    this.shutdown = shutdown;
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async handleDeploymentResults() {
    await this.amqp.consume({
      messageType: 'contractDeploymentResult',
      messageVersion: '1.*',
      handler: ({ content, properties }) => {
        this.log.info(`${content.result}: ${content.contractName} ${content.version} at ${content.address} on ${content.network}`);
        this.emit(properties.headers.requestId, content);
      },
    });
  }

  /**
   *
   * @param {object} _artifact
   * @param {string} networkName
   * @param {string} networkId
   * @returns {Promise<void>}
   */
  async publishOne(_artifact, networkName, networkId) {
    const requestId = uuid();
    const artifact = Object.assign({}, _artifact);
    artifact.abi = JSON.parse(artifact.abi);
    artifact.networks = {};
    artifact.networks[networkId] = { address: artifact.address, transactionHash: artifact.transactionHash };
    this.log.info(`Publishing ${artifact.contractName} at ${artifact.address}, requestId: ${requestId}`);
    const artifactString = JSON.stringify(artifact);
    // console.log(artifactString);
    // TODO: get FDD contracts out / separate

    await new Promise((resolve, reject) => {
      const timeout = scheduleTimeout(reject);

      // eslint-disable-next-line require-jsdoc
      const handler = (content) => {
        this.removeListener(requestId, handler);
        clearTimeout(timeout);
        resolve(content);
      };

      this.on(requestId, handler);

      this.amqp.publish({
        messageType: 'contractDeployment',
        messageVersion: '1.*',
        content: {
          network: networkName,
          networkId,
          version: '1.0.0',
          artifact: artifactString,
        },
        customHeaders: {
          product: 'platform',
          requestId,
        },
      });
    });
  }


  /**
   * Bootstrap and listen
   * @return {Promise<void>}
   */
  async bootstrap() {
    const truffle = require('../../truffle-config');
    const networkName = process.env.NETWORK || 'development';
    const networkId = truffle.networks[networkName].network_id;

    this.log.info(`Starting publishing contracts for Network Name: ${networkName}, Id: ${networkId}`);

    this.handleDeploymentResults();

    const artifacts = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
    for (let index = 0; index < artifacts.length; index += 1) {
      const artifact = artifacts[index];
      await this.publishOne(artifact, networkName, networkId);
    }

    this.log.info('RePublished GIF Core Contracts');
    this.shutdown();
  }
}

module.exports = Contracts;
