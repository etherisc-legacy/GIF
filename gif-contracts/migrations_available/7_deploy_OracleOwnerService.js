const { info } = require('../io/logger');
const progress = require('../bin/lib/progress');


const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const OracleOwnerService = artifacts.require('controllers/OracleOwnerService.sol');


module.exports = progress(['ProductService'], ['OracleOwnerService'], async (deployer, networks, accounts) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(OracleOwnerService, registry.address, { gas: 1000000 });

  const oracleOwnerService = await OracleOwnerService.deployed();
  const OracleOwnerServiceName = await oracleOwnerService.NAME.call();

  info('Register OracleOwnerService in Registry');
  await registry.registerService(OracleOwnerServiceName, oracleOwnerService.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));
});
