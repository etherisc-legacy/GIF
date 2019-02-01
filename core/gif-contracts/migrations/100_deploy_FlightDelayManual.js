const FlightDelayManual = artifacts.require('examples/FlightDelayManual/FlightDelayManual.sol');
const InsuranceProductService = artifacts.require('services/InsuranceProductService.sol');
const DAOService = artifacts.require('services/DAOService.sol');


module.exports = async (deployer) => {
  const productService = await InsuranceProductService.deployed();
  const daoService = await DAOService.deployed();

  await deployer.deploy(FlightDelayManual, productService.address);
  const registrationId = 0;

  // Approve insurance product
  await daoService.approveRegistration(registrationId);
};
