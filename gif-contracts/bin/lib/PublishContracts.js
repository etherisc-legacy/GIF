const fs = require('fs-extra');

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
    this.shutdown = shutdown.bind(this);
  }

  /**
     * Bootstrap and listen
     * @return {Promise<void>}
     */
  async bootstrap() {
    const truffle = require('../../truffle-config');
    const networkName = process.env.NETWORK || 'development';
    const networkId = parseInt(truffle.networks[networkName].network_id, 10);
    const buildDir = './build';

    this.log.info(`Starting publishing contracts for Network Name: ${networkName}, Id: ${networkId}`);

    const files = fs.readdirSync(buildDir);
    const artifacts = files.map(file => fs.readFileSync(`${buildDir}/${file}`, 'utf-8'));

    for (let index = 0; index < artifacts.length; index += 1) {
      const artifact = artifacts[index];
      const artifactContent = JSON.parse(artifact);

      if (artifactContent.networks[networkId]) {
        this.log.info(`Publishing ${artifactContent.contractName} at ${artifactContent.networks[networkId].address}`);

        const product = 'platform';

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
    // this.shutdown(); // won't publish otherwise
  }
}

module.exports = Contracts;
