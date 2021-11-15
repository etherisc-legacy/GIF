const info = console.log

const Registry = artifacts.require('modules/registry/Registry.sol')
const InstanceOperatorService = artifacts.require('gif-services/InstanceOperatorService.sol')
const PolicyController = artifacts.require('modules/query/StakeController.sol')
const Policy = artifacts.require('modules/query/Stake.sol')

module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed()
  const policy = await Policy.deployed()
  const instanceOperator = await InstanceOperatorService.deployed()

  info('Deploy new PolicyController')
  await deployer.deploy(PolicyController, registryStorage.address, { gas: 6000000 })
  const policyController = await PolicyController.deployed()

  await instanceOperator.assignController(policy.address, policyController.address)
}
