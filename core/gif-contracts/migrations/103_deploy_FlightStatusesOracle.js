const axios = require('axios');
const { web3utils, logger: { info } } = require('../io/module')(web3, artifacts);


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

  const prodUrl = await flightStatusesOracle.getOraclizeUrl.call(web3utils.bytes(32, 'AA/100'), web3utils.bytes(32, '2019/02/02'), { gas: 300000 });
  info('Oraclize production url: %s\n', prodUrl);

  /* COMMENT/UNCOMMENT IF YOU WANT IN TEST MODE */
  info('Set test mode');
  await flightStatusesOracle.setTestMode(true, { gas: 200000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  const testUrl = await flightStatusesOracle.getOraclizeUrl.call(
    web3utils.bytes(32, 'AA/100'),
    web3utils.bytes(32, '2019/02/02'),
    { gas: 200000 },
  );

  info('Oraclize test url: %s', testUrl);
  /* COMMENT/UNCOMMENT IF YOU WANT IN TEST MODE */

  info('Propose FlightStatuses OracleType');
  await oracleOwnerService.proposeOracleType(
    web3utils.bytes(32, 'FlightStatuses'),
    '(uint256 time,bytes32 carrierFlightNumber,bytes32 departureYearMonthDay)',
    '(bytes1 status,int256 delay)',
    'FlightStatuses oracle',
    { gas: 300000 },
  )
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  info('Propose FlightStatusesOracle as Oracle');
  await oracleOwnerService.proposeOracle(flightStatusesOracle.address, 'FlightStatuses oracle', { gas: 200000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  info('Activate FlightStatuses OracleType');
  await daoService.activateOracleType(web3utils.bytes(32, 'FlightStatuses'), { gas: 200000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  info('Activate FlightStatuses Oracle');
  const oracleId = 1;
  await daoService.activateOracle(oracleId, { gas: 200000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  info('Propose FlightStatusesOracle to FlightStatuses OracleType');
  await oracleOwnerService.proposeOracleToType(web3utils.bytes(32, 'FlightStatuses'), oracleId, { gas: 200000 })
    .on('transactionHash', txHash => info(`transaction hash: ${txHash}\n`));

  info('Assign FlightStatusesOracle to FlightStatuses OracleType');
  const proposalId = 0;
  await daoService.assignOracleToOracleType(web3utils.bytes(32, 'FlightStatuses'), proposalId, { gas: 200000 });
};
