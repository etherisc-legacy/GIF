const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const Policy = artifacts.require('modules/policy/Policy.sol');
const PolicyController = artifacts.require('modules/policy/PolicyController.sol');


module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  // Deploy storage and controller contracts
  await deployer.deploy(Policy, registryStorage.address, { gas: 2000000 });
  await deployer.deploy(PolicyController, registryStorage.address, { gas: 4000000 });

  const policyStorage = await Policy.deployed();
  const policyController = await PolicyController.deployed();

  // Bind storage & controller contracts
  await policyStorage.assignController(policyController.address, { gas: 100000 });
  await policyController.assignStorage(policyStorage.address, { gas: 100000 });

  // Register License module in Registry
  const policyStorageName = await policyStorage.NAME.call();
  await registry.register(policyStorageName, policyStorage.address, { gas: 100000 });
};
