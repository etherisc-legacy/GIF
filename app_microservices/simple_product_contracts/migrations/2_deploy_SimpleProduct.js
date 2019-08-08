const SimpleProduct = artifacts.require('SimpleProduct');

const GIF_PRODUCT_SERVICE_CONTRACT = process.env.GIF_PRODUCT_SERVICE_CONTRACT || '0x0';
const PRODUCT_NAME = web3.utils.fromAscii(process.env.PRODUCT_NAME || 'SampleProduct');

module.exports = deployer => deployer.deploy(SimpleProduct, GIF_PRODUCT_SERVICE_CONTRACT, PRODUCT_NAME);
