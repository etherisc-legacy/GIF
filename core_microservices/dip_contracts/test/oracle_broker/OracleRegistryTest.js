require('../setup');


const OracleRegistry = artifacts.require('OracleRegistry');

contract('OracleRegistry', (accounts) => {
  let oracleRegistry;
  const sampleOracleType = 'SampleOracleType';

  const registryOwner = accounts[0];
  const oracleAddress = accounts[1];
  const frontAddress = accounts[2];

  beforeEach(async () => {
    oracleRegistry = await OracleRegistry.new(frontAddress, { from: registryOwner });
    // simulate broker front with account #3, account #1 is an owner
  });

  it('should revert if non-front tries to register an Oracle', async () => {
    let errorMessage;
    try {
      await oracleRegistry.registerOracle(sampleOracleType, oracleAddress, { from: oracleAddress });
    } catch (error) {
      errorMessage = error.message;
    }
    errorMessage.should.equal('Returned error: VM Exception while processing transaction: revert');
  });

  it('should save an Address on front request', async () => {
    await oracleRegistry.registerOracle(sampleOracleType, oracleAddress, { from: frontAddress });
    const registeredOracles = await oracleRegistry.getOracles(sampleOracleType);
    registeredOracles.should.be.an('array').that.includes(oracleAddress);
  });

  it('should revert if front requests to register an Oracle the second time', async () => {
    await oracleRegistry.registerOracle(sampleOracleType, oracleAddress, { from: frontAddress });

    let errorMessage;
    try {
      await oracleRegistry.registerOracle(sampleOracleType, oracleAddress, { from: frontAddress });
    } catch (error) {
      errorMessage = error.message;
    }
    errorMessage.should.equal('Returned error: VM Exception while processing transaction: revert');
  });

  it('should make oracle inactive on front request', async () => {
    await oracleRegistry.registerOracle(sampleOracleType, oracleAddress, { from: frontAddress });

    const initialOracleCounts = await oracleRegistry.getOraclesCount.call(sampleOracleType);
    initialOracleCounts.active.should.eq.BN(1);
    initialOracleCounts.total.should.eq.BN(1);

    await oracleRegistry.removeOracle(sampleOracleType, oracleAddress, { from: frontAddress });

    const finalOracleCounts = await oracleRegistry.getOraclesCount.call(sampleOracleType);
    finalOracleCounts.active.should.eq.BN(0);
    finalOracleCounts.total.should.eq.BN(1);

    const oracleInfo = await oracleRegistry.getOracleInfoByIndex.call(sampleOracleType, 0);

    oracleInfo.state.should.eq.BN(2); // OracleState 2 - Inactive
  });

  /*
    it('should ...', async () => {

    });
    */
});
