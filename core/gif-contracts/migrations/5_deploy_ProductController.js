const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const ProductController = artifacts.require('controllers/ProductController.sol');


module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(ProductController, registry.address);

  const productController = await ProductController.deployed();
  const productControllerName = await productController.NAME.call();

  await registry.register(productControllerName, productController.address);
};
