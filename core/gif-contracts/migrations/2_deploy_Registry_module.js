const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');


module.exports = async (deployer) => {
  // Deploy storage and controller contracts
  await deployer.deploy(RegistryController);

  const registryController = await RegistryController.deployed();
  await deployer.deploy(Registry, registryController.address);

  const registryStorage = await Registry.deployed();

  // Bind storage & controller contracts
  await registryController.assignStorage(registryStorage.address);
};
