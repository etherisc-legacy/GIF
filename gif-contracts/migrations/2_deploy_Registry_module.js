const { verify } = require('truffle-source-verify/lib');
const { info } = require('../io/logger');


const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const initialRelease = web3.utils.bytesToHex('1.0.0');

module.exports = async (deployer, network) => {
  // Deploy storage and controller contracts
  await deployer.deploy(RegistryController, initialRelease, { gas: 2000000 });

  const registryController = await RegistryController.deployed();

  await deployer.deploy(Registry, registryController.address, initialRelease, { gas: 1000000 });

  const registryStorage = await Registry.deployed();

  info('Assign controller to storage');
  await registryController.assignStorage(registryStorage.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  if (network === 'xdai') {
    info('Verifying Registry on Blockscout');
    await verify(['Registry'], 'xdai', 'Apache-2.0');
    info('Verifying RegistryController on Blockscout');
    await verify(['RegistryController'], 'xdai', 'Apache-2.0');
  }
};
