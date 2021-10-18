const info = console.log;

const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const InstanceOperatorService = artifacts.require('gif-services/InstanceOperatorService.sol');
const PolicyFlowDefault = artifacts.require('flows/PolicyFlowDefault.sol');

module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);
  const instanceOperatorService = await InstanceOperatorService.deployed();

  info('Deploy new PolicyFlowDefault');
  await deployer.deploy(PolicyFlowDefault, registry.address, { gas: 3000000 });

  const policyFlowDefault = await PolicyFlowDefault.deployed();
  const policyFlowDefaultName = await policyFlowDefault.NAME.call();

  info('Register PolicyFlowDefault in Registry');

  await instanceOperatorService.register(policyFlowDefaultName, policyFlowDefault.address, { gas: 100000 })
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}\n`));
};
