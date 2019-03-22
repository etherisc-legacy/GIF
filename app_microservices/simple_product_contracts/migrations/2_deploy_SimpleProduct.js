const SimpleProduct = artifacts.require('SimpleProduct');

const GIF_PRODUCT_SERVICE_CONTRACT = '0x0';

module.exports = deployer => deployer.deploy(SimpleProduct, GIF_PRODUCT_SERVICE_CONTRACT);
