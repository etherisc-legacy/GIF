const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const PolicyFlowDefault = artifacts.require('policyFlows/PolicyFlowDefault.sol');


module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(PolicyFlowDefault, registry.address);

  const policyFlowDefault = await PolicyFlowDefault.deployed();
  const policyFlowDefaultName = await policyFlowDefault.NAME.call();

  await registry.register(policyFlowDefaultName, policyFlowDefault.address);
};
