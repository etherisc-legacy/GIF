const FlightDelayOraclize = artifacts.require('examples/FlightDelayManual/FlightDelayOraclize.sol');
const ProductService = artifacts.require('services/ProductService.sol');
const DAOService = artifacts.require('services/DAOService.sol');


module.exports = async (deployer) => {
  const productService = await ProductService.deployed();
  const daoService = await DAOService.deployed();

  await deployer.deploy(FlightDelayOraclize, productService.address, { gas: 3500000 });

  const registrationId = 1;

  // Approve insurance product
  await daoService.approveRegistration(registrationId, { gas: 200000 });
};
