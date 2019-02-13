const FlightDelayManual = artifacts.require('examples/FlightDelayManual/FlightDelayManual.sol');
const ProductService = artifacts.require('services/ProductService.sol');
const DAOService = artifacts.require('services/DAOService.sol');


module.exports = async (deployer) => {
  const productService = await ProductService.deployed();
  const daoService = await DAOService.deployed();

  await deployer.deploy(FlightDelayManual, productService.address);
  const registrationId = 0;

  // Approve product
  await daoService.approveRegistration(registrationId);
};
