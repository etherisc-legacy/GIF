const { verify } = require('truffle-source-verify/lib');
const { info } = require('../io/logger');


const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const Policy = artifacts.require('modules/policy/Policy.sol');
const PolicyController = artifacts.require('modules/policy/PolicyController.sol');


module.exports = async (deployer, network) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  // Deploy storage and controller contracts
  await deployer.deploy(Policy, registryStorage.address, 0, 0, 0, 0, 0, { gas: 2000000 });

  await deployer.deploy(PolicyController, registryStorage.address, { gas: 4000000 });
  // Etherscan doesn't detects constructor arguments for this contract
  info('PolicyController constructor arguments: %s\n', web3.eth.abi.encodeParameters(['address'], [registryStorage.address]).substr(2));

  const policyStorage = await Policy.deployed();
  const policyController = await PolicyController.deployed();

  info('Assign controller to storage');
  await policyStorage.assignController(policyController.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  info('Assign storage to controller');
  await policyController.assignStorage(policyStorage.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  const policyStorageName = await policyStorage.NAME.call();

  info('Register Policy module in Registry');
  await registry.register(policyStorageName, policyStorage.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  if (network === 'xdai') {
    info('Verifying Policy on Blockscout');
    await verify(['Policy'], 'xdai', 'Apache-2.0');
    info('Verifying PolicyController on Blockscout');
    await verify(['PolicyController'], 'xdai', 'Apache-2.0');
  }
};
