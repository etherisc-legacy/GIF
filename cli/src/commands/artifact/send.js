const fs = require('fs-jetpack');
const { flags } = require('@oclif/command');
const BaseCommand = require('../../lib/BaseCommand');

/**
 * Create or replace artifact for products' contract
 */
class SendArtifact extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    if (!this.gif) {
      this.error(this.errorMessages.notConnectedToGif);
    }

    await this.gif.connect();

    const { flags: { file, network } } = this.parse(SendArtifact);

    const networkInfo = this.eth.networkByName(network);
    if (!networkInfo) {
      this.error(this.errorMessages.unknownNetwork);
    }

    const artifactContent = fs.read(file, 'utf8');
    const artifact = JSON.parse(artifactContent);

    const deployment = artifact.networks[networkInfo.id];
    if (!deployment) {
      this.error(this.errorMessages.noDeployment);
    }

    const response = await this.gif.cli.artifact.send({
      network,
      networkId: networkInfo.id,
      artifact: artifactContent,
      version: this.config.version,
    });

    if (response.error) {
      this.error(response.error);
    } else {
      this.log(response);
    }

    await this.gif.shutdown();
  }
}

SendArtifact.flags = {
  file: flags.string({ char: 'f', description: 'truffle artifacts file', required: true }),
  network: flags.string({ char: 'n', description: 'network', required: true }),
};


SendArtifact.description = `Send artifact
...
Send artifacts
`;

module.exports = SendArtifact;
