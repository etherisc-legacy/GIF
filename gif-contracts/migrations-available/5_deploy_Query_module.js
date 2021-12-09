// eslint-disable-next-line no-console
const info = console.log

const Registry = artifacts.require('modules/registry/Registry.sol')
const RegistryController = artifacts.require('modules/registry/RegistryController.sol')
const Query = artifacts.require('modules/query/Query.sol')
const QueryController = artifacts.require('modules/query/QueryController.sol')

module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed()
  const registry = await RegistryController.at(registryStorage.address)

  // Deploy storage and controller contracts
  await deployer.deploy(Query, registryStorage.address)
  await deployer.deploy(QueryController, registryStorage.address)

  const queryStorage = await Query.deployed()
  const queryController = await QueryController.deployed()

  // Bind storage & controller contracts
  info('Assign controller to storage')
  await queryStorage.assignController(queryController.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))

  info('Assign storage to controller')
  await queryController.assignStorage(queryStorage.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))

  const queryStorageName = await queryStorage.NAME.call()
  const queryControllerName = await queryController.NAME.call()

  info('Register Query module in Registry')
  await registry.register(queryStorageName, queryStorage.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))
  await registry.register(queryControllerName, queryController.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))
}
