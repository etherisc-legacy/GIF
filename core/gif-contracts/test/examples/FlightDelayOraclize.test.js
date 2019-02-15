const moment = require('moment');
const { web3utils } = require('../../io/module')(web3, artifacts);


const FlightDelayOraclize = artifacts.require('examples/FlightDelayOraclize/FlightDelayOraclize.sol');
const FlightStatusesOracle = artifacts.require('examples/OraclizeBridgeOracles/FlightStatusesOracle.sol');


contract('FlightDelayOraclize', () => {
  it('e2e - landed, no delay, expired', async () => {
    const fdd = await FlightDelayOraclize.deployed();

    await FlightStatusesOracle.deployed();

    const payouts = await fdd.calculatePayouts.call(2000, [61, 5, 1, 4, 0, 0]);
    const payoutOptions = payouts._payoutOptions.map(el => el.toString());

    const application = {
      carrierFlightNumber: web3utils.bytes(32, 'AF/24'),
      yearMonthDay: web3utils.bytes(32, moment().add(1, 'day').format('YYYY/MM/DD')),
      departureTime: moment().add(2, 'day').unix(),
      arrivalTime: moment().add(3, 'days').unix(),
      premium: 2000,
      currency: web3utils.bytes(32, 'EUR'),
      payoutOptions,
      customerExternalId: web3utils.bytes(32, '12345'),
    };

    await fdd.applyForPolicy(
      application.carrierFlightNumber,
      application.yearMonthDay,
      application.departureTime,
      application.arrivalTime,
      application.premium,
      application.currency,
      application.payoutOptions,
      application.customerExternalId,
    );

    await new Promise((resolve, reject) => {
      setTimeout(reject, 60000);

      fdd.allEvents({
        fromBlock: web3.eth.blockNumber,
        toBlock: 'latest',
      })
        .on('data', (log) => {
          if (log.event === 'LogRequestPayout') {
            resolve();
          }
        });
    });
  });
});
