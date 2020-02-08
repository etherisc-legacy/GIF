const fs = require('fs-extra');
const truffle = require('../gif-contracts/truffle-config');

/**
 * DIP Artifacts Storage microservice
 */
class Contracts {
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
    this.amqp = amqp;
    this.config = config;
    this.log = log;
    this.shutdown = shutdown;
  }

  /**
   * Bootstrap and listen
   * @return {Promise<void>}
   */
  async bootstrap() {
    const networkName = process.env.NETWORK || 'development';
    const networkId = truffle.networks[networkName].network_id;

    this.log.info(`Starting publishing contracts for Network Name: ${networkName}, Id: ${networkId}`);

    const artifacts = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
    for (let index = 0; index < artifacts.length; index += 1) {
      const artifact = artifacts[index];
      // console.log(artifact);
      artifact.networks = [];
      artifact.networks[networkName] = {};
      artifact.networks[networkName][networkId.toString()] = { address: artifact.address };
      this.log.info(`Publishing ${artifact.contractName}`);
      this.log.info(artifact);

      // TODO: get FDD contracts out / separate
      const product = artifact.contractName.match(/Flight/) ? 'fdd' : 'platform';

      await this.amqp.publish({
        messageType: 'contractDeployment',
        messageVersion: '1.*',
        content: {
          network: networkName,
          networkId,
          version: '1.0.0',
          artifact,
        },
        customHeaders: {
          product,
        },
      });
    }

    this.log.info('Published content of build folder');
    this.shutdown();
  }
}

module.exports = Contracts;
