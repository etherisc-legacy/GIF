/* eslint-disable no-console */
const InstanceOperatorService = artifacts.require('gif-services/InstanceOperatorService.sol');
const OracleOwnerService = artifacts.require('controllers/OracleOwnerService.sol');
const Query = artifacts.require('modules/query/Query.sol');

module.exports = async (deployer, networks, accounts) => {
  const bytes32FlightStatuses = web3.bytes(32, 'FlightStatuses');
  // Deploy FlightStatusesOracle
  const from = accounts[0];
  const dummyAddress = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';

  console.log('Propose FlightStatusesOracle as oracle');
  await OracleOwnerService.methods.proposeOracle(
    dummyAddress,
    'Chainlink FlightStatuses oracle',
  )
    .send({ from, gas: 200000 })
    .on('transactionHash', txHash => console.log(`transaction hash: ${txHash}\n`));

  const oracleId = await Query.methods.oracleIdByAddress(dummyAddress).call();

  console.log(`Activate FlightStatuses Oracle, oracleId = ${oracleId}`);
  await InstanceOperatorService.methods.activateOracle(oracleId)
    .send({ from, gas: 200000 })
    .on('transactionHash', txHash => console.log(`transaction hash: ${txHash}\n`));

  console.log('Propose FlightStatusesOracle to FlightStatuses OracleType');
  await OracleOwnerService.methods.proposeOracleToType(bytes32FlightStatuses, oracleId);

  console.log(`Assign FlightStatusesOracle to FlightStatuses OracleType, proposalId = ${oracleId}`);
  await InstanceOperatorService.methods.assignOracleToOracleType(bytes32FlightStatuses, oracleId)
    .send({ from, gas: 200000 })
    .on('transactionHash', txHash => console.log(`transaction hash: ${txHash}\n`));
};
