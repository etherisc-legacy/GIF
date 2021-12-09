// eslint-disable-next-line no-console
const info = console.log

// const Registry = artifacts.require('modules/registry/Registry.sol')
// const RegistryController = artifacts.require('modules/registry/RegistryController.sol')
const InstanceOperatorService = artifacts.require('gif-services/InstanceOperatorService.sol')
const PolicyFlowDefault = artifacts.require('flows/PolicyFlowDefault.sol')

module.exports = async (/* deployer */) => {
//   const registryStorage = await Registry.deployed()
  // const registry = await RegistryController.at(registryStorage.address)
  // const registryAddress = '0x1F13C64749862db56B4309c0fCF303E19D72e9DE'
  const instanceOperatorServiceAddress = '0x14c519990935f60B287Dc28596B5E4B9C4Ebd33b'
  // const instanceOperatorService = await InstanceOperatorService.deployed()
  const instanceOperatorService = await InstanceOperatorService.at(instanceOperatorServiceAddress)

  // info('Deploy new PolicyFlowDefault')
  // await deployer.deploy(PolicyFlowDefault, registryAddress, { gas: 3000000 })

  const policyFlowDefault = await PolicyFlowDefault.deployed()
  const policyFlowDefaultName = await policyFlowDefault.NAME.call()

  info('Register PolicyFlowDefault in Registry')

  await instanceOperatorService.register(policyFlowDefaultName, policyFlowDefault.address)
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}\n`))
}
