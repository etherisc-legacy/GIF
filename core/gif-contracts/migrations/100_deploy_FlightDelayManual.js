const FlightDelayManual = artifacts.require('examples/FlightDelayManual/FlightDelayManual.sol');
const ProductController = artifacts.require('controllers/ProductController.sol');
const DAOController = artifacts.require('controllers/DAOController.sol');


module.exports = async (deployer) => {
  const productController = await ProductController.deployed();
  const daoController = await DAOController.deployed();

  await deployer.deploy(FlightDelayManual, productController.address);
  const registrationId = 0;

  // Approve product
  await daoController.approveRegistration(registrationId);
};
