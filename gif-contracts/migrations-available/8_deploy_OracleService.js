const info = console.log

const Registry = artifacts.require('modules/registry/Registry.sol')
const RegistryController = artifacts.require('modules/registry/RegistryController.sol')
const OracleService = artifacts.require('controllers/OracleService.sol')

module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed()
  const registry = await RegistryController.at(registryStorage.address)

  await deployer.deploy(OracleService, registry.address, { gas: 1000000 })

  const oracleService = await OracleService.deployed()
  const oracleServiceName = await oracleService.NAME.call()

  info('Register OracleService in Registry')
  await registry.register(oracleServiceName, oracleService.address, { gas: 100000 })
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}\n`))
}
