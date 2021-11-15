const info = console.log

const { settings } = require('../package.json')

const Registry = artifacts.require('modules/registry/Registry.sol')
const RegistryController = artifacts.require('modules/registry/RegistryController.sol')
const initialRelease = web3.utils.fromAscii(settings.release)

module.exports = async (deployer) => {
  // Deploy storage and controller contracts-available
  await deployer.deploy(RegistryController, initialRelease, { gas: 2000000 })

  const registryController = await RegistryController.deployed()

  await deployer.deploy(Registry, registryController.address, initialRelease, { gas: 1000000 })

  const registryStorage = await Registry.deployed()
  const registry = await RegistryController.at(registryStorage.address)

  info('Assign controller to storage')
  await registryController.assignStorage(registryStorage.address, { gas: 100000 })
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}\n`))

  const registryStorageName = await registryStorage.NAME.call()
  const registryControllerName = await registryController.NAME.call()

  info('Register Registry module in Registry')
  await registry.register(registryStorageName, registryStorage.address, { gas: 100000 })
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}\n`))
  await registry.register(registryControllerName, registryController.address, { gas: 100000 })
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}\n`))
}
