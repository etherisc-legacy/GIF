const fs = require('fs-jetpack');
const { flags } = require('@oclif/command');
const BaseCommand = require('../../lib/BaseCommand');

/**
 *
 * @param{{}} obj
 * @param{{}} cond
 * @returns {*}
 */
const objectFind = (obj, cond) => Object.keys(obj).map(item => obj[item]).find(cond);

/**
 * Create or replace artifact for products' contract
 */
class SendArtifact extends BaseCommand {
  /**
   *
   * @param{{}} artifact
   * @returns {*}
   */
  getVersion(artifact) {
    const { contractName, ast } = artifact;
    const { nodes } = ast;
    const main = objectFind(nodes, item => item.name === contractName);
    const versionNode = objectFind(main.nodes, item => item.name === 'VERSION');
    if (!versionNode) {
      this.error(this.errorMessages.noVersion);
    }
    return versionNode.value.value;
  }

  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    if (!this.gif) {
      this.error(this.errorMessages.notConnectedToGif);
    }

    await this.gif.connect();

    const { flags: { file, network, networkId } } = this.parse(SendArtifact);

    const artifactContent = fs.read(file, 'utf8');
    const artifact = JSON.parse(artifactContent);
    const version = this.getVersion(artifact);
    const deployment = artifact.networks[networkId];
    if (!deployment) {
      this.error(this.errorMessages.noDeployment);
    }
    this.log(`Sending ${artifact.contractName} to ${network}, networkId=${networkId}, version ${version}`);
    const response = await this.gif.sendArtifact({
      network,
      networkId,
      artifact: artifactContent,
      version,
    });

    if (response.error) {
      this.error(response.error);
    } else {
      this.log(JSON.stringify(response, null, 2));
    }

    await this.gif.shutdown();
  }
}

SendArtifact.flags = {
  file: flags.string({ char: 'f', description: 'truffle artifacts file', required: true }),
  network: flags.string({ char: 'n', description: 'network', required: true }),
  networkId: flags.integer({ char: 'i', description: 'networkId', required: true }),
};


SendArtifact.description = `Send artifact
...
Send artifacts
`;

module.exports = SendArtifact;
