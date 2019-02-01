const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const InsuranceProductService = artifacts.require('services/InsuranceProductService.sol');


module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(InsuranceProductService, registry.address);

  const productService = await InsuranceProductService.deployed();
  const productServiceName = await productService.NAME.call();

  await registry.register(productServiceName, productService.address);
};
