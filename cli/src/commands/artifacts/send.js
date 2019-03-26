const fs = require('fs-jetpack');
const { flags } = require('@oclif/command');
const BaseCommand = require('../../lib/BaseCommand');

/**
 * Create or replace artifacts for products' contract
 */
class SendArtifacts extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    if (!this.gif) {
      this.error('You are not logged-in or product not provided');
    }

    const { flags: { file, network } } = this.parse(SendArtifacts);

    const networkInfo = this.eth.networkByName(network);
    if (!networkInfo) {
      throw new Error('Unknown network');
    }

    const artifactContent = fs.read(file, 'utf8');
    const artifact = JSON.parse(artifactContent);

    const deployment = artifact.networks[networkInfo.id];
    if (!deployment) {
      throw new Error('No deployment');
    }

    await this.gif.artifacts.send({
      network,
      networkId: networkInfo.id,
      artifact: artifactContent,
      version: this.config.version,
    });

    this.log('Artifacts sent');
  }
}

SendArtifacts.flags = {
  file: flags.string({ char: 'f', description: 'truffle artifacts file', required: true }),
  network: flags.string({ char: 'n', description: 'network', required: true }),
};


SendArtifacts.description = `Send artifacts
...
Send artifacts
`;

module.exports = SendArtifacts;
