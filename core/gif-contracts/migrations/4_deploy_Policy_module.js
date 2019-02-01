const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const Policy = artifacts.require('modules/policy/Policy.sol');
const PolicyController = artifacts.require('modules/policy/PolicyController.sol');


module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  // Deploy storage and controller contracts
  await deployer.deploy(Policy, registryStorage.address);
  await deployer.deploy(PolicyController, registryStorage.address);

  const policyStorage = await Policy.deployed();
  const policyController = await PolicyController.deployed();

  // Bind storage & controller contracts
  await policyStorage.assignController(policyController.address);
  await policyController.assignStorage(policyStorage.address);

  // Register License module in Registry
  const policyStorageName = await policyStorage.NAME.call();
  await registry.register(policyStorageName, policyStorage.address);
};
