require('../setup');


const OracleRegistry = artifacts.require('OracleRegistry');
const OracleRequestRegistry = artifacts.require('OracleRequestRegistry');
const OracleTypeRegistry = artifacts.require('OracleTypeRegistry');
const OracleBrokerFront = artifacts.require('OracleBrokerFront');

contract('OracleBrokerFront', (accounts) => {
  let oracleTypeRegistry; let oracleRegistry; let oracleRequestRegistry; let oracleBrokerFront; let
    frontAddress;

  const emptyAddress = '0x0000000000000000000000000000000000000000';
  const ownerAddress = accounts[0];
  const productAddress = accounts[1];

  const oracleData = {
    oracleTypeId: 'SampleOracleType',
    callbackSignature: '(uint8)',
    inputFormat: 'string',
    description: 'Some data',
  };

  beforeEach(async () => {
    oracleBrokerFront = await OracleBrokerFront.new(
      emptyAddress, emptyAddress, emptyAddress, emptyAddress,
      { from: ownerAddress },
    );
    frontAddress = oracleBrokerFront.address;

    oracleTypeRegistry = await OracleTypeRegistry.new(frontAddress, { from: ownerAddress });
    oracleRegistry = await OracleRegistry.new(frontAddress, { from: ownerAddress });
    oracleRequestRegistry = await OracleRequestRegistry.new(frontAddress, { from: ownerAddress });

    await oracleBrokerFront.registerOracleTypeRegistry(oracleTypeRegistry.address, { from: ownerAddress });
    await oracleBrokerFront.registerOracleRegistry(oracleRegistry.address, { from: ownerAddress });
    await oracleBrokerFront.registerRequestRegistry(oracleRequestRegistry.address, { from: ownerAddress });

    await oracleBrokerFront.proposeOracleType(
      oracleData.oracleTypeId,
      oracleData.callbackSignature,
      oracleData.inputFormat,
      oracleData.description,
      emptyAddress,
      { from: productAddress },
    );

    await oracleTypeRegistry.activateOracleType(
      oracleData.oracleTypeId,
      { from: ownerAddress },
    );
  });

  it('should provide access to an OracleType registry', async () => {
    const oracleType = await oracleBrokerFront.getOracleType(oracleData.oracleTypeId);

    oracleType.description.should.equal(oracleData.description);
    oracleType.callbackSignature.should.equal(oracleData.callbackSignature);
    oracleType.inputFormat.should.equal(oracleData.inputFormat);
    oracleType.state.should.eq.BN(2); // TypeState 2 - Active
  });


  /*
 it('should ...', async () => {

 });
 */
});
