// eslint-disable-next-line no-console
const info = console.log

const { settings } = require('../package.json')

const Registry = artifacts.require('modules/registry/Registry.sol')
const RegistryController = artifacts.require('modules/registry/RegistryController.sol')
const initialRelease = web3.utils.fromAscii(settings.release)

module.exports = async (deployer) => {
  info('here0')
  // Deploy storage and controller contracts-available-available
  await deployer.deploy(RegistryController, initialRelease)

  const registryController = await RegistryController.deployed()

  await deployer.deploy(Registry, registryController.address, initialRelease)

  const registryStorage = await Registry.deployed()
  const registry = await RegistryController.at(registryStorage.address)

  info('Assign controller to storage')
  await registryController.assignStorage(registryStorage.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))

  const registryStorageName = await registryStorage.NAME.call()
  const registryControllerName = await registryController.NAME.call()

  info('Register Registry module in Registry')
  await registry.register(registryStorageName, registryStorage.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))
  await registry.register(registryControllerName, registryController.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))
}
