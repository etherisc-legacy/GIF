const { info } = require('../io/logger');
const progress = require('../bin/lib/progress');


const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const PolicyFlowDefault = artifacts.require('policyFlows/PolicyFlowDefault.sol');


module.exports = progress(['OracleService'], ['PolicyFlow'], async (deployer, networks, accounts) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(PolicyFlowDefault, registry.address, { gas: 3000000 });

  const policyFlowDefault = await PolicyFlowDefault.deployed();
  const policyFlowDefaultName = await policyFlowDefault.NAME.call();

  info('Register PolicyFlowDefault Registry');
  await registry.register(policyFlowDefaultName, policyFlowDefault.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));
});
