const { info } = require('../io/logger');
const progress = require('../bin/lib/progress');


const Registry = artifacts.require('modules/registry/Registry.sol');
const InstanceOperatorService = artifacts.require('gif-services/InstanceOperatorService.sol');
const QueryController = artifacts.require('modules/query/QueryController.sol');
const Query = artifacts.require('modules/query/Query.sol');

module.exports = progress(['RegisterSandbox'], ['Update 01'], async (deployer, networks, accounts) => {
  const instanceOperatorOld = await InstanceOperatorService.deployed();
  const registryStorage = await Registry.deployed();
  const query = await Query.deployed();

  info('Deploy New InstanceOperatorService');
  await deployer.deploy(InstanceOperatorService, registryStorage.address, { gas: 2000000 });
  const instanceOperator = await InstanceOperatorService.deployed();
  const instanceOperatorName = await instanceOperator.NAME.call();

  info('Register New InstanceOperatorService in Registry');
  await instanceOperatorOld.registerService(instanceOperatorName, instanceOperator.address, { gas: 100000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  info('Deploy new QueryController');
  await deployer.deploy(QueryController, registryStorage.address, { gas: 6000000 });
  const queryController = await QueryController.deployed();

  await instanceOperator.assignController(query.address, queryController.address);
});
