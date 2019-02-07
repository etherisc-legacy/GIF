const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const Query = artifacts.require('modules/query/Query.sol');
const QueryController = artifacts.require('modules/query/QueryController.sol');


module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  // Deploy storage and controller contracts
  await deployer.deploy(Query, registryStorage.address, { gas: 2000000 });
  await deployer.deploy(QueryController, registryStorage.address, { gas: 6000000 });

  const queryStorage = await Query.deployed();
  const queryController = await QueryController.deployed();

  // Bind storage & controller contracts
  await queryStorage.assignController(queryController.address, { gas: 100000 });
  await queryController.assignStorage(queryStorage.address, { gas: 100000 });

  // Register License module in Registry
  const queryStorageName = await queryStorage.NAME.call();
  await registry.register(queryStorageName, queryStorage.address, { gas: 100000 });
};
