const { verify } = require('truffle-source-verify/lib');
const { info } = require('../io/logger');


const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const ProductService = artifacts.require('gif-services/ProductService.sol');


module.exports = async (deployer, network) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  await deployer.deploy(ProductService, registry.address, { gas: 1000000 });

  const productService = await ProductService.deployed();
  const productServiceName = await productService.NAME.call();

  info('Register ProductService in Registry');
  await registry.register(productServiceName, productService.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  if (network === 'xdai') {
    info('Verifying ProductService on Blockscout');
    await verify(['ProductService'], 'xDai', 'Apache-2.0');
  }
};
