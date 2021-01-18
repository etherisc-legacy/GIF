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
    const {
      flags: {
        product, file, network, networkId,
      },
    } = this.parse(SendArtifact);
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
      console.log(response.error);
      this.error(response.error);
    } else {
      this.log(JSON.stringify(response.data));
    }
  }
}

SendArtifact.flags = {
  product: flags.string({ char: 'p', description: 'product designator', required: true }),
  file: flags.string({ char: 'f', description: 'truffle artifacts file', required: true }),
  network: flags.string({ char: 'n', description: 'network', required: true }),
  networkId: flags.integer({ char: 'i', description: 'networkId', required: true }),
};


SendArtifact.description = `Send artifact
...
Send artifacts
`;

module.exports = SendArtifact;
