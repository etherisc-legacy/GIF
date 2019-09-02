const fs = require('fs-extra');
const truffle = require('./truffle-config');

/**
 * DIP Artifacts Storage microservice
 */
class Contracts {
  /**
     * Constructor
     * @param {object} amqp
     * @param {object} config
     * @param {object} log
     */
  constructor({
    amqp, config, log,
  }) {
    this.amqp = amqp;
    this.config = config;
    this.log = log;
  }

  /**
     * Bootstrap and listen
     * @return {Promise<void>}
     */
  async bootstrap() {
    const networkName = process.env.NETWORK || 'development';
    const networkId = truffle.networks[networkName].network_id;

    this.log.info(`Starting publishing contracts for Network Name: ${networkName}, Id: ${networkId}`);

    const files = fs.readdirSync('./build');
    const artifacts = files.map(file => fs.readFileSync(`./build/${file}`, 'utf-8'));

    for (let index = 0; index < artifacts.length; index += 1) {
      const artifact = artifacts[index];
      const artifactContent = JSON.parse(artifact);

      if (artifactContent.networks[networkId]) {
        this.log.info(`Publishing ${artifactContent.contractName}`);

        // TODO: get FDD contracts out / separate
        const product = artifactContent.contractName.match(/Flight/) ? 'fdd' : 'platform';

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
    }

    this.log.info('Published content of build folder');

    // TODO: Use centralized 'shutdown' instruction from shared/microservice (to be implemented)
  }
}

module.exports = Contracts;
