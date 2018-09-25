const FlightDelayInsurance = require('../FlightDelayInsurance');


describe('FlightDelayInsurance', () => {
  it('app name should contain package name and version', () => {
    const fdd = new FlightDelayInsurance();

    const packageJson = require('../package');

    `${packageJson.name}.v${packageJson.version}`.should.be.equal(fdd.name);
  });
});
