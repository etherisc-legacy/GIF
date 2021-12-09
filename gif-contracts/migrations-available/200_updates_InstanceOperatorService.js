// eslint-disable-next-line no-console
const info = console.log

const Registry = artifacts.require('modules/registry/Registry.sol')
const InstanceOperatorService = artifacts.require('gif-services/InstanceOperatorService.sol')

module.exports = async (deployer) => {
  const instanceOperatorOld = await InstanceOperatorService.deployed()
  const registryStorage = await Registry.deployed()

  info('Deploy New InstanceOperatorService')
  await deployer.deploy(InstanceOperatorService, registryStorage.address)
  const instanceOperator = await InstanceOperatorService.deployed()
  const instanceOperatorName = await instanceOperator.NAME.call()

  info('Register New InstanceOperatorService in Registry')
  await instanceOperatorOld.register(instanceOperatorName, instanceOperator.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}\n`))
}
