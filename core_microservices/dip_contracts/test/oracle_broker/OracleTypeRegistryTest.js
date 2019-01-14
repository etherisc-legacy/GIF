require('../setup');


const OracleTypeRegistry = artifacts.require('OracleTypeRegistry');
const CustomOracleTypeLogic = artifacts.require('CustomOracleTypeLogic');

contract('OracleTypeRegistry', (accounts) => {
  let typeRegistry;
  const oracleData = {
    oracleTypeId: 'SampleOracleType',
    callbackSignature: '(uint8)',
    inputFormat: 'string',
    description: 'Some data',
  };

  const registryOwner = accounts[0];
  const frontAddress = accounts[1];
  const productAddress = accounts[2];
  const oracleAddress = accounts[3];

  beforeEach(async () => {
    typeRegistry = await OracleTypeRegistry.new(frontAddress);

    typeRegistry.propose = async (data) => {
      const proposedTypeData = {
        customLogicContract: '0x0000000000000000000000000000000000000000',
        ...oracleData,
        ...data,
      };
      await typeRegistry.proposeOracleType(
        proposedTypeData.oracleTypeId,
        proposedTypeData.callbackSignature,
        proposedTypeData.inputFormat,
        proposedTypeData.description,
        proposedTypeData.customLogicContract,
        { from: proposedTypeData.from, gas: 200000 },
      );
    };

    typeRegistry.activate = async (data) => {
      await typeRegistry.activateOracleType(
        data.oracleTypeId,
        { from: data.from, gas: 200000 },
      );
    };
  });

  it('should accept oracle type registration requests', async () => {
    await typeRegistry.propose({ from: frontAddress });

    const sampleOracleType = await typeRegistry.getOracleType(oracleData.oracleTypeId);

    sampleOracleType.description.should.equal(oracleData.description);
    sampleOracleType.callbackSignature.should.equal(oracleData.callbackSignature);
    sampleOracleType.inputFormat.should.equal(oracleData.inputFormat);
    sampleOracleType.state.should.eq.BN(1); // TypeState 1 - Proposed
  });

  it('should not accept an oracle type registration with an existing Id', async () => {
    let errorMessage;

    await typeRegistry.propose({ from: frontAddress });

    try {
      await typeRegistry.propose({ description: '', from: frontAddress });
    } catch (error) {
      errorMessage = error.message;
    }

    errorMessage.should.equal('Returned error: VM Exception while processing transaction: revert');
  });

  it('should not accept an oracle type approval from non-owner', async () => {
    let errorMessage;
    await typeRegistry.propose({ from: frontAddress });

    try {
      await typeRegistry.activate({ ...oracleData, from: productAddress });
    } catch (error) {
      errorMessage = error.message;
    }

    errorMessage.should.equal('Returned error: VM Exception while processing transaction: revert');
  });

  it('should accept an oracle type approval from TypeRegistry owner', async () => {
    await typeRegistry.propose({ from: frontAddress });

    await typeRegistry.activate({ ...oracleData, from: registryOwner });

    const sampleOracleType = await typeRegistry.getOracleType(oracleData.oracleTypeId);

    sampleOracleType.state.should.eq.BN(2); // TypeState 2 - Active
  });

  it('validateForOracleRegistration should return true for active Oracle Types', async () => {
    await typeRegistry.propose({ from: frontAddress });
    await typeRegistry.activate({ ...oracleData, from: registryOwner });

    const result = await typeRegistry.validateForOracleRegistration(oracleData.oracleTypeId, oracleAddress);
    result.should.equal(true);
  });

  it('should accept an oracle type deprecation from TypeRegistry owner', async () => {
    await typeRegistry.propose({ from: frontAddress });
    await typeRegistry.activate({ ...oracleData, from: registryOwner });

    await typeRegistry.deprecateOracleType(
      oracleData.oracleTypeId,
      { from: registryOwner, gas: 200000 },
    );

    const sampleOracleType = await typeRegistry.getOracleType(oracleData.oracleTypeId);

    sampleOracleType.state.should.eq.BN(3); // TypeState 3 - Deprecated
  });

  it('should not accept an address for custom logic if the contract there does not implement proper interface', async () => {
    const newOracleTypeId = 'CustomizedOracleType';
    let errorMessage;

    try {
      await typeRegistry.propose({
        oracleTypeId: newOracleTypeId,
        customLogicContract: '0x1234567800000000000000000000000000000000',
        from: frontAddress,
      });
    } catch (error) {
      errorMessage = error.message;
    }

    errorMessage.should.equal('Returned error: VM Exception while processing transaction: revert');
  });

  it('should accept an address for custom logic if the contract there implements proper interface', async () => {
    const newOracleTypeId = 'CustomizedOracleType';

    const customOracleTypeLogic = await CustomOracleTypeLogic.new();

    await typeRegistry.propose({
      oracleTypeId: newOracleTypeId,
      customLogicContract: customOracleTypeLogic.address,
      from: frontAddress,
    });

    const sampleOracleType = await typeRegistry.getOracleType(newOracleTypeId);

    sampleOracleType.description.should.equal(oracleData.description);
    sampleOracleType.customLogicContract.should.equal(customOracleTypeLogic.address);
  });
});
