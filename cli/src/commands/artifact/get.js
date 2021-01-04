const { flags } = require('@oclif/command');
const BaseCommand = require('../../lib/BaseCommand');

/**
 * Create or replace artifact for products' contract
 */
class GetArtifact extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    if (!this.gif) {
      this.error(this.errorMessages.notConnectedToGif);
    }

    await this.gif.connect();

    const { flags: { product, networkName, contractName } } = this.parse(GetArtifact);
    const response = await this.gif.getArtifact(product, networkName, contractName);

    if (response.error) {
      this.error(response.error);
    } else {
      this.log(response);
    }

    await this.gif.shutdown();
  }
}

GetArtifact.flags = {
  product: flags.string({ char: 'c', description: 'product [=platform for core contracts]', required: true }),
  networkName: flags.string({ char: 'c', description: 'network name', required: true }),
  contractName: flags.string({ char: 'c', description: 'contract name', required: true }),
};


GetArtifact.description = `Get artifact
...
Get artifact for contract
`;

module.exports = GetArtifact;
