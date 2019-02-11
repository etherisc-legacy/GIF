const { info } = require('../io/logger');


const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const DAOService = artifacts.require('controllers/DAOService.sol');


module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(DAOService, registry.address, { gas: 2000000 });

  const daoService = await DAOService.deployed();
  const daoName = await daoService.NAME.call();

  info('Register DAO in Registry');
  await registry.registerService(daoName, daoService.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));
};
