const { info } = require('../io/logger');
const progress = require('../bin/lib/progress');


const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const InstanceOperatorService = artifacts.require('services/InstanceOperatorService.sol');


module.exports = progress(['PolicyFlow'], ['InstanceOperatorService'], async (deployer, networks, accounts) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(InstanceOperatorService, registry.address, { gas: 2000000 });

  const instanceOperator = await InstanceOperatorService.deployed();
  const instanceOperatorName = await instanceOperator.NAME.call();

  info('Register InstanceOperatorService in Registry');
  await registry.registerService(instanceOperatorName, instanceOperator.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));
});
