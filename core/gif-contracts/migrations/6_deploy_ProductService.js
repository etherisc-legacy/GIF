const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const ProductService = artifacts.require('services/ProductService.sol');


module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(ProductService, registry.address);

  const productService = await ProductService.deployed();
  const productServiceName = await productService.NAME.call();

  await registry.register(productServiceName, productService.address);
};
