const { info } = require('../io/logger');


const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');


module.exports = async (deployer) => {
  // Deploy storage and controller contracts
  await deployer.deploy(RegistryController, { gas: 2000000 });

  const registryController = await RegistryController.deployed();
  await deployer.deploy(Registry, registryController.address, { gas: 1000000 });

  const registryStorage = await Registry.deployed();

  info('Assign controller to storage');
  await registryController.assignStorage(registryStorage.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));
};
