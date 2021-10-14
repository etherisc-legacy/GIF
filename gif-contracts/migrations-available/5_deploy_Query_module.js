const info = console.log;

const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const Query = artifacts.require('modules/query/Query.sol');
const QueryController = artifacts.require('modules/query/QueryController.sol');

module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  // Deploy storage and controller contracts-available
  await deployer.deploy(Query, registryStorage.address, { gas: 2000000 });
  await deployer.deploy(QueryController, registryStorage.address, { gas: 6000000 });

  const queryStorage = await Query.deployed();
  const queryController = await QueryController.deployed();

  // Bind storage & controller contracts-available
  info('Assign controller to storage');
  await queryStorage.assignController(queryController.address, { gas: 100000 })
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}\n`));

  info('Assign storage to controller');
  await queryController.assignStorage(queryStorage.address, { gas: 100000 })
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}\n`));

  const queryStorageName = await queryStorage.NAME.call();
  const queryControllerName = await queryController.NAME.call();

  info('Register Query module in Registry');
  await registry.register(queryStorageName, queryStorage.address, { gas: 100000 })
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}\n`));
  await registry.register(queryControllerName, queryController.address, { gas: 100000 })
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}\n`));
};
