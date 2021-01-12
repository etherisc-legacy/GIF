const { info } = require('../io/logger');
const progress = require('../bin/lib/progress');


const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const OracleService = artifacts.require('controllers/OracleService.sol');


module.exports = progress(['OracleOwnerService'], ['OracleService'], async (deployer, networks, accounts) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(OracleService, registry.address, { gas: 1000000 });

  const oracleService = await OracleService.deployed();
  const oracleServiceName = await oracleService.NAME.call();

  info('Register OracleService in Registry');
  await registry.registerService(oracleServiceName, oracleService.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));
});
