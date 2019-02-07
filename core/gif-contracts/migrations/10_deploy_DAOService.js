const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const DAOService = artifacts.require('controllers/DAOService.sol');


module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(DAOService, registry.address, { gas: 2000000 });

  const daoService = await DAOService.deployed();
  const daoName = await daoService.NAME.call();

  await registry.registerService(daoName, daoService.address, { gas: 100000 });
};
