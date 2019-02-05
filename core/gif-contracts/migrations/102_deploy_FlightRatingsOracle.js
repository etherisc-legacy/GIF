const axios = require('axios');
const { web3utils } = require('../io/module')(web3, artifacts);


const DAOService = artifacts.require('services/DAOService.sol');
const OracleService = artifacts.require('services/OracleService.sol');
const OracleOwnerService = artifacts.require('services/OracleOwnerService.sol');
const FlightRatingsOracle = artifacts.require('examples/OraclizeBridgeOracles/FlightRatingsOracle.sol');


module.exports = async (deployer) => {
  const daoService = await DAOService.deployed();
  const oracleService = await OracleService.deployed();
  const oracleOwnerService = await OracleOwnerService.deployed();

  if (!process.env.FLIGHTSTATS_APP_ID) throw new Error('FLIGHTSTATS_APP_ID should be defined');
  if (!process.env.FLIGHTSTATS_APP_KEY) throw new Error('FLIGHTSTATS_APP_KEY should be defined');

  const encryptedQueryReq = await axios.post('https://api.oraclize.it/v1/utils/encryption/encrypt', {
    message: `appId=${process.env.FLIGHTSTATS_APP_ID}&appKey=${process.env.FLIGHTSTATS_APP_KEY}`,
  });

  // Deploy FlightRatingsOracle
  const flightRatingsOracle = await deployer.deploy(
    FlightRatingsOracle, oracleService.address, encryptedQueryReq.data.result, {
      value: 1 * (10 ** 18),
    },
  );

  const prodUrl = await flightRatingsOracle.getOraclizeUrl.call(web3utils.bytes(32, 'AA/100'));
  console.log('Oraclize production url:', prodUrl);

  /* UNCOMMENT IF YOU WANT IN TEST MODE */
  await flightRatingsOracle.setTestMode(true);
  const testUrl = await flightRatingsOracle.getOraclizeUrl.call(web3utils.bytes(32, 'AA/100'));
  console.log('Oraclize test url:', testUrl);
  /* UNCOMMENT IF YOU WANT IN TEST MODE */

  // Propose FlightRatings oracle type
  await oracleOwnerService.proposeOracleType(
    web3utils.bytes(32, 'FlightRatings'),
    '(bytes32 carrierFlightNumber)',
    '(uint256[6] statistics)',
    'FlightRatings oracle',
  );

  // Propose FlightRatingsOracle as oracle
  await oracleOwnerService.proposeOracle(flightRatingsOracle.address, 'FlightRatings oracle');

  // Activate FlightRatings type and oracle
  await daoService.activateOracleType(web3utils.bytes(32, 'FlightRatings'));

  const oracleId = 0;
  await daoService.activateOracle(oracleId);

  // Propose FlightRatingsOracle to FlightRatings oracle type
  await oracleOwnerService.proposeOracleToType(web3utils.bytes(32, 'FlightRatings'), oracleId);
  const proposalId = 0;
  await daoService.assignOracleToOracleType(web3utils.bytes(32, 'FlightRatings'), proposalId);
};
