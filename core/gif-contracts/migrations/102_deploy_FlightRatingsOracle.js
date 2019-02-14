const axios = require('axios');
const { web3utils, logger: { info } } = require('../io/module')(web3, artifacts);


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
      gas: 4000000,
    },
  );

  const prodUrl = await flightRatingsOracle.getOraclizeUrl.call(web3utils.bytes(32, 'AA/100'), { gas: 300000 });
  info('Oraclize production url: %s\n', prodUrl);

  /* COMMENT/UNCOMMENT IF YOU WANT IN TEST MODE */
  info('Set test mode');
  await flightRatingsOracle.setTestMode(true, { gas: 200000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  const testUrl = await flightRatingsOracle.getOraclizeUrl.call(web3utils.bytes(32, 'AA/100'), { gas: 200000 });
  info('Oraclize test url: %s', testUrl);
  /* COMMENT/UNCOMMENT IF YOU WANT IN TEST MODE */

  info('Propose OracleType');
  await oracleOwnerService.proposeOracleType(
    web3utils.bytes(32, 'FlightRatings'),
    '(bytes32 carrierFlightNumber)',
    '(uint256[6] statistics)',
    'FlightRatings oracle',
    { gas: 300000 },
  )
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  info('Propose FlightRatingsOracle as oracle');
  await oracleOwnerService.proposeOracle(flightRatingsOracle.address, 'FlightRatings oracle', { gas: 200000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  info('Activate FlightRatings OracleType');
  await daoService.activateOracleType(web3utils.bytes(32, 'FlightRatings'), { gas: 200000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  info('Activate FlightRatings Oracle');
  const oracleId = 0;
  await daoService.activateOracle(oracleId, { gas: 200000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  info('Propose FlightRatingsOracle to FlightRatings OracleType');
  await oracleOwnerService.proposeOracleToType(web3utils.bytes(32, 'FlightRatings'), oracleId, { gas: 200000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  info('Assign FlightRatingsOracle to FlightRatings OracleType');
  const proposalId = 0;
  await daoService.assignOracleToOracleType(web3utils.bytes(32, 'FlightRatings'), proposalId, { gas: 200000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));
};
