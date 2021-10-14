const info = console.log;

const Registry = artifacts.require('modules/registry/Registry.sol');
const InstanceOperatorService = artifacts.require('gif-services/InstanceOperatorService.sol');
const QueryController = artifacts.require('modules/query/QueryController.sol');
const Query = artifacts.require('modules/query/Query.sol');

module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const query = await Query.deployed();
  const instanceOperator = await InstanceOperatorService.deployed();

  info('Deploy new QueryController');
  await deployer.deploy(QueryController, registryStorage.address, { gas: 6000000 });
  const queryController = await QueryController.deployed();

  await instanceOperator.assignController(query.address, queryController.address);
};
