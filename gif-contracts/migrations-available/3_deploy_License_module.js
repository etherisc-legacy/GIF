// eslint-disable-next-line no-console
const info = console.log

const Registry = artifacts.require('modules/registry/Registry.sol')
const RegistryController = artifacts.require('modules/registry/RegistryController.sol')
const License = artifacts.require('modules/license/License.sol')
const LicenseController = artifacts.require('modules/license/LicenseController.sol')

module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed()
  const registry = await RegistryController.at(registryStorage.address)

  // Deploy storage and controller contracts
  await deployer.deploy(License, registryStorage.address)
  await deployer.deploy(LicenseController, registryStorage.address)

  const licenseStorage = await License.deployed()
  const licenseController = await LicenseController.deployed()

  info('Assign controller to storage')
  await licenseStorage.assignController(licenseController.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))

  info('Assign storage to controller')
  await licenseController.assignStorage(licenseStorage.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))

  const licenseStorageName = await licenseStorage.NAME.call()
  const licenseControllerName = await licenseController.NAME.call()

  info('Register License module in Registry')
  await registry.register(licenseStorageName, licenseStorage.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))
  await registry.register(licenseControllerName, licenseController.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))
}
