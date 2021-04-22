/* eslint-disable no-console */
module.exports = async (deployer, networks, accounts) => {
  const InstanceOperatorService = await artifacts.require('gif-services/InstanceOperatorService.sol')
    .deployed();
  const OracleOwnerService = await artifacts.require('controllers/OracleOwnerService.sol')
    .deployed();
  const Query = await artifacts.require('modules/query/Query.sol')
    .deployed();

  const bytes32FlightStatuses = web3.utils.bytesToHex(32, 'FlightStatuses');

  const dummyAddress = '0xdeadbeefdeadbeefdeadbeefdeadbeefdead1245';

  const oracleType = await Query.oracleTypes(bytes32FlightStatuses);
  if (!oracleType.initialized) {
    console.log('Propose FlightStatuses OracleType');
    await OracleOwnerService.proposeOracleType(
      bytes32FlightStatuses,
      '(uint256 time,bytes32 carrierFlightNumber,bytes32 departureYearMonthDay)',
      '(bytes1 status,int256 delay)',
      'FlightStatuses oracle',
    );
    console.log('Activate FlightStatuses OracleType');
    await InstanceOperatorService.activateOracleType(bytes32FlightStatuses);
  }

  console.log('Propose FlightStatusesOracle as oracle');
  await OracleOwnerService.proposeOracle(dummyAddress, 'Chainlink FlightStatuses oracle');

  const oracleId = await Query.oracleIdByAddress(dummyAddress);

  console.log(`Activate FlightStatuses Oracle, oracleId = ${oracleId}`);
  await InstanceOperatorService.activateOracle(oracleId);

  console.log('Propose FlightStatusesOracle to FlightStatuses OracleType');
  await OracleOwnerService.proposeOracleToOracleType(bytes32FlightStatuses, oracleId);

  console.log(`Assign FlightStatusesOracle to FlightStatuses OracleType, oracleId = ${oracleId}`);
  await InstanceOperatorService.assignOracleToOracleType(bytes32FlightStatuses, oracleId);
};
