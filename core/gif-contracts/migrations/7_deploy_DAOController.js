const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const DAOController = artifacts.require('controllers/DAOController.sol');


module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(DAOController, registry.address);

  const daoController = await DAOController.deployed();
  const daoName = await daoController.NAME.call();

  await registry.registerController(daoName, daoController.address);
};
