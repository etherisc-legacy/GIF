const info = console.log

const Registry = artifacts.require('modules/registry/Registry.sol')
const InstanceOperatorService = artifacts.require('gif-services/InstanceOperatorService.sol')

module.exports = async (deployer) => {
  const instanceOperatorOld = await InstanceOperatorService.deployed()
  const registryStorage = await Registry.deployed()

  info('Deploy New InstanceOperatorService')
  await deployer.deploy(InstanceOperatorService, registryStorage.address, { gas: 2000000 })
  const instanceOperator = await InstanceOperatorService.deployed()
  const instanceOperatorName = await instanceOperator.NAME.call()

  info('Register New InstanceOperatorService in Registry')
  await instanceOperatorOld.register(instanceOperatorName, instanceOperator.address, { gas: 100000 })
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}\n`))
}
