// eslint-disable-next-line no-console
const info = console.log

const Registry = artifacts.require('modules/registry/Registry.sol')
const RegistryController = artifacts.require('modules/registry/RegistryController.sol')
const InstanceOperatorService = artifacts.require('gif-services/InstanceOperatorService.sol')

module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed()
  const registry = await RegistryController.at(registryStorage.address)

  await deployer.deploy(InstanceOperatorService, registry.address)

  const instanceOperator = await InstanceOperatorService.deployed()
  const instanceOperatorName = await instanceOperator.NAME.call()

  info('Register InstanceOperatorService in Registry')
  await registry.register(instanceOperatorName, instanceOperator.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))
}
