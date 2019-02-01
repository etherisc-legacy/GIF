const FlightDelayOraclize = artifacts.require('examples/FlightDelayManual/FlightDelayOraclize.sol');
const InsuranceProductService = artifacts.require('services/InsuranceProductService.sol');
const DAOService = artifacts.require('services/DAOService.sol');


module.exports = async (deployer) => {
  const productService = await InsuranceProductService.deployed();
  const daoService = await DAOService.deployed();

  await deployer.deploy(FlightDelayOraclize, productService.address);

  const registrationId = 1;

  // Approve insurance product
  await daoService.approveRegistration(registrationId);
};
