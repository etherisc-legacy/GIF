const fs = require('fs-jetpack');
const _ = require('lodash');

/**
 * Load and parse artifacts files
 * @param {{}} web3
 * @return {Promise<Array>}
 */
async function tempSaveArtifacts(web3) {
  const files = fs.find('./TO_BE_REFACTORED/artifacts', { matching: '*.json' });

  const artifacts = files.map(file => JSON.parse(fs.read(file)));

  const knownEvents = {};
  const knownContracts = [];

  // Prepare known events
  const abis = _.flatMap(artifacts, 'abi');

  abis.forEach((abi) => {
    if (abi.type === 'event') {
      const signature = `${abi.name}(${_.map(abi.inputs, 'type').join(',')})`;

      knownEvents[web3.utils.sha3(signature)] = {
        signature,
        name: abi.name,
        inputs: abi.inputs,
      };
    }
  });

  // Prepare known contracts
  artifacts.forEach((artifact) => {
    const networks = _.keys(artifact.networks);

    if (networks.length) {
      const { contractName, abi } = artifact;

      const { address, transactionHash } = artifact.networks[networks[0]];

      knownContracts.push({
        contractName,
        networkId: networks[0],
        address,
        transactionHash,
        abi,
      });
    }
  });

  return knownContracts;
}

module.exports = tempSaveArtifacts;
