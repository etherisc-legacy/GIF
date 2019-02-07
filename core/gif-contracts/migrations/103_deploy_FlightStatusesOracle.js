const axios = require('axios');
const { web3utils } = require('../io/module')(web3, artifacts);


const DAOService = artifacts.require('controllers/DAOService.sol');
const OracleService = artifacts.require('controllers/OracleService.sol');
const OracleOwnerService = artifacts.require('controllers/OracleOwnerService.sol');
const FlightStatusesOracle = artifacts.require('examples/OraclizeBridgeOracles/FlightStatusesOracle.sol');


module.exports = async (deployer) => {
  const daoService = await DAOService.deployed();
  const oracleService = await OracleService.deployed();
  const oracleOwnerService = await OracleOwnerService.deployed();

  if (!process.env.FLIGHTSTATS_APP_ID) throw new Error('FLIGHTSTATS_APP_ID should be defined');
  if (!process.env.FLIGHTSTATS_APP_KEY) throw new Error('FLIGHTSTATS_APP_KEY should be defined');

  const encryptedQueryReq = await axios.post('https://api.oraclize.it/v1/utils/encryption/encrypt', {
    message: `appId=${process.env.FLIGHTSTATS_APP_ID}&appKey=${process.env.FLIGHTSTATS_APP_KEY}`,
  });

  // Deploy FlightStatusesOracle
  const flightStatusesOracle = await deployer.deploy(
    FlightStatusesOracle, oracleService.address, encryptedQueryReq.data.result, {
      value: 1 * (10 ** 18),
      gas: 4500000,
    },
  );

  const prodUrl = await flightStatusesOracle.getOraclizeUrl.call(web3utils.bytes(32, 'AA/100'), web3utils.bytes(32, '2019/02/02'), { gas: 200000 });
  console.log('Oraclize production url:', prodUrl);

  /* UNCOMMENT IF YOU WANT IN TEST MODE */
  // await flightStatusesOracle.setTestMode(true);
  //
  // const testUrl = await flightStatusesOracle.getOraclizeUrl.call(
  //   web3utils.bytes(32, 'AA/100'),
  //   web3utils.bytes(32, '2019/02/02'),
  // );
  //
  // console.log('Oraclize test url:', testUrl);
  /* UNCOMMENT IF YOU WANT IN TEST MODE */

  // Propose FlightStatuses oracle type
  await oracleOwnerService.proposeOracleType(
    web3utils.bytes(32, 'FlightStatuses'),
    '(uint256 time,bytes32 carrierFlightNumber,bytes32 departureYearMonthDay)',
    '(bytes1 status,int256 delay)',
    'FlightStatuses oracle',
    { gas: 200000 },
  );

  // Propose FlightStatusesOracle as oracle
  await oracleOwnerService.proposeOracle(flightStatusesOracle.address, 'FlightStatuses oracle', { gas: 200000 });

  // Activate FlightStatuses type and oracle
  await daoService.activateOracleType(web3utils.bytes(32, 'FlightStatuses'), { gas: 200000 });
  const oracleId = 1;
  await daoService.activateOracle(oracleId, { gas: 200000 });

  // Propose FlightRatingsOracle to FlightRatings oracle type
  await oracleOwnerService.proposeOracleToType(web3utils.bytes(32, 'FlightStatuses'), oracleId, { gas: 200000 });
  const proposalId = 0;
  await daoService.assignOracleToOracleType(web3utils.bytes(32, 'FlightStatuses'), proposalId, { gas: 200000 });
};
