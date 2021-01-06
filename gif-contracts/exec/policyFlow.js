const ProductService = artifacts.require('contracts/gif-services/ProductService.sol');
const IProductService = artifacts.require('contracts/gif-services/IProductService.sol');
const License = artifacts.require('contracts/modules/license/License.sol');
const Policy = artifacts.require('contracts/modules/policy/Policy.sol');

/**
 * Run commands
 * @return {Promise<void>}
 */
async function run() {
  const ps = await ProductService.deployed();
  const productService = await IProductService.at(ps.address);
  const license = await License.deployed();
  const policy = await Policy.deployed();

  const licenseLogs = [];
  license.allEvents().on('data', log => licenseLogs.push(log));

  const policyLogs = [];
  policy.allEvents().on('data', log => policyLogs.push(log));

  await productService.register(web3.utils.utf8ToHex('testProductSevice'), web3.utils.utf8ToHex('PolicyFlowDefault'));

  console.log(licenseLogs[0].args.productId.toString());

  await productService.newApplication(web3.utils.utf8ToHex('customerId'), 1, web3.utils.utf8ToHex('eur'), ['1', '2', '3', '4']);
}

module.exports = async (cb) => {
  try {
    await run();
    cb();
  } catch (e) {
    console.log(e);
    cb();
  }
};
