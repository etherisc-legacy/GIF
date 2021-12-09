// eslint-disable-next-line no-console
const info = console.log

const Registry = artifacts.require('modules/registry/Registry.sol')
const RegistryController = artifacts.require('modules/registry/RegistryController.sol')
const Policy = artifacts.require('modules/policy/Policy.sol')
const PolicyController = artifacts.require('modules/policy/PolicyController.sol')

module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed()
  const registry = await RegistryController.at(registryStorage.address)

  // Deploy storage and controller contracts
  await deployer.deploy(Policy, registryStorage.address)

  await deployer.deploy(PolicyController, registryStorage.address)

  const policyStorage = await Policy.deployed()
  const policyController = await PolicyController.deployed()

  info('Assign controller to storage')
  await policyStorage.assignController(policyController.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))

  info('Assign storage to controller')
  await policyController.assignStorage(policyStorage.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))

  const policyStorageName = await policyStorage.NAME.call()
  const policyControllerName = await policyController.NAME.call()

  info('Register Policy module in Registry')
  await registry.register(policyStorageName, policyStorage.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))
  await registry.register(policyControllerName, policyController.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))
}
