const { info } = require('../io/logger');


const FlightDelayManual = artifacts.require('examples/FlightDelayManual/FlightDelayManual.sol');
const ProductService = artifacts.require('services/ProductService.sol');
const DAOService = artifacts.require('services/DAOService.sol');


module.exports = async (deployer) => {
  const productService = await ProductService.deployed();
  const daoService = await DAOService.deployed();

  await deployer.deploy(FlightDelayManual, productService.address, { gas: 3000000 });
  const registrationId = 0;

  info('Approve product');
  await daoService.approveRegistration(registrationId, { gas: 200000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));
};
