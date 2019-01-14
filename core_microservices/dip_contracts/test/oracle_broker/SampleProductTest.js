require('../setup');


const OracleRegistry = artifacts.require('OracleRegistry');
const OracleRequestRegistry = artifacts.require('OracleRequestRegistry');
const OracleTypeRegistry = artifacts.require('OracleTypeRegistry');
const OracleResponseHandler = artifacts.require('OracleResponseHandler');
const OracleBrokerFront = artifacts.require('OracleBrokerFront');
const OraclizeBridge = artifacts.require('OraclizeBridge');
const OraclizeBridgeTestProduct = artifacts.require('OraclizeBridgeTestProduct');

const SampleCustomOracleTypeLogic = artifacts.require('SampleCustomOracleTypeLogic');
const SampleProduct = artifacts.require('SampleProduct');
const SampleOracleBridge = artifacts.require('SampleOracleBridge');

const oraclizeResolverAddress = '0x6f485c8bf6fc43ea212e93bbf8ce046c7f1cb475';

contract('SampleProduct (integration test)', (accounts) => {
  const emptyAddress = '0x0000000000000000000000000000000000000000';
  const [brokerOwnerAddress, productOwnerAddress, oracleOwnerAddress] = accounts;

  const sampleRequestInput = 10;
  const sampleOracleResponse = 7;

  const gasLimit = 1000000;

  const oracleData = {
    oracleTypeId: 'SampleRandomNumber',
    callbackSignature: 'uint',
    inputFormat: 'uint',
    description: 'Pass an integer, receive an integer between a zero and this number in callback',
  };

  let oracleBrokerFront; let frontAddress;
  let oracleTypeRegistry; let oracleRegistry;
  let oracleRequestRegistry; let oracleResponseHandler;
  let sampleOracleTypeLogic;

  beforeEach(async () => {
    // Deploy and prepare an Oracle Broker
    oracleBrokerFront = await OracleBrokerFront.new(
      emptyAddress, emptyAddress, emptyAddress, emptyAddress,
      { from: brokerOwnerAddress },
    );
    frontAddress = oracleBrokerFront.address;

    oracleTypeRegistry = await OracleTypeRegistry.new(frontAddress, { from: brokerOwnerAddress });
    oracleRegistry = await OracleRegistry.new(frontAddress, { from: brokerOwnerAddress });
    oracleRequestRegistry = await OracleRequestRegistry.new(frontAddress, { from: brokerOwnerAddress });
    oracleResponseHandler = await OracleResponseHandler.new(frontAddress, { from: brokerOwnerAddress });

    await oracleBrokerFront.registerOracleTypeRegistry(oracleTypeRegistry.address, { from: brokerOwnerAddress });
    await oracleBrokerFront.registerOracleRegistry(oracleRegistry.address, { from: brokerOwnerAddress });
    await oracleBrokerFront.registerRequestRegistry(oracleRequestRegistry.address, { from: brokerOwnerAddress });
    await oracleBrokerFront.registerResponseHandler(oracleResponseHandler.address, { from: brokerOwnerAddress });

    // Deploy, propose and accept an Oracle Type
    sampleOracleTypeLogic = await SampleCustomOracleTypeLogic.new({ from: productOwnerAddress });

    await oracleBrokerFront.proposeOracleType(
      oracleData.oracleTypeId,
      oracleData.callbackSignature,
      oracleData.inputFormat,
      oracleData.description,
      sampleOracleTypeLogic.address,
      { from: productOwnerAddress },
    );

    await oracleTypeRegistry.activateOracleType(
      oracleData.oracleTypeId,
      { from: brokerOwnerAddress },
    );
  });

  it('should work through a whole cycle', async () => {
    // Deploy a sample Oracle
    const sampleOracleBridge = await SampleOracleBridge.new({ from: oracleOwnerAddress });

    // The sample type implements whitelisting, so initial attempt to add an Oracle is expected to raise
    let initialRegistrationError;
    try {
      await sampleOracleBridge.connectToBrokerFront(
        frontAddress,
        oracleData.oracleTypeId,
        { from: oracleOwnerAddress },
      );
    } catch (error) {
      initialRegistrationError = error.message;
    }
    initialRegistrationError.should.equal('Returned error: VM Exception while processing transaction: revert');

    // After whitelisting, adding the OracleBridge should be successful
    await sampleOracleTypeLogic.addToWhitelist(sampleOracleBridge.address, { from: productOwnerAddress });

    await sampleOracleBridge.connectToBrokerFront(
      frontAddress,
      oracleData.oracleTypeId,
      { from: oracleOwnerAddress },
    );

    const oracleInfo = await oracleRegistry.getOracleInfo.call(
      oracleData.oracleTypeId,
      sampleOracleBridge.address,
      { from: oracleOwnerAddress },
    );

    oracleInfo.state.should.eq.BN(1); // OracleState 1 - Active

    // Deploy sample product and make a request to BrokerFront
    const sampleProduct = await SampleProduct.new(frontAddress, { from: productOwnerAddress });
    const oracleRequest = await sampleProduct.getRandomNumberUnder(sampleRequestInput, { from: productOwnerAddress });

    let productInternalRequestId;
    oracleRequest.logs.forEach((log) => {
      if (log.event === 'ProductRequestRegistered') {
        productInternalRequestId = log.args.id;
      }
    });
    productInternalRequestId.should.be.a('string');

    // As OracleOwner, check that there is a new request in the Oracle Bridge
    const firstRequest = await sampleOracleBridge.getRequestByIndex.call(0, { from: oracleOwnerAddress });
    firstRequest.input.should.eq.BN(sampleRequestInput);

    // An off-chain calculation in the Oracle happens and an OracleBridge receives a transaction with the response

    await sampleOracleBridge.submitResponse(
      firstRequest.id, sampleOracleResponse,
      { from: oracleOwnerAddress },
    );

    // check that response got to Sample Product
    const response = await sampleProduct.getResponse.call(productInternalRequestId);
    response.should.eq.BN(sampleOracleResponse);
  });

  it('should keep track of gas usage', async () => {
    // Deploy a sample Oracle
    const sampleOracleBridge = await SampleOracleBridge.new({ from: oracleOwnerAddress });

    // After whitelisting, adding the OracleBridge should be successful
    await sampleOracleTypeLogic.addToWhitelist(sampleOracleBridge.address, { from: productOwnerAddress });
    await sampleOracleBridge.connectToBrokerFront(
      frontAddress,
      oracleData.oracleTypeId,
      { from: oracleOwnerAddress },
    );

    let totalGasUsedWithBroker = 0;
    // Deploy sample product and make a request to BrokerFront

    const sampleProduct = await SampleProduct.new(frontAddress, { from: productOwnerAddress });
    const oracleRequest = await sampleProduct.getRandomNumberUnder(sampleRequestInput, { from: productOwnerAddress });

    totalGasUsedWithBroker += oracleRequest.receipt.cumulativeGasUsed;

    // As OracleOwner, check that there is a new request in the Oracle Bridge
    const firstRequest = await sampleOracleBridge.getRequestByIndex.call(0, { from: oracleOwnerAddress });
    const oracleResponse = await sampleOracleBridge.submitResponse(
      firstRequest.id, sampleOracleResponse,
      { from: oracleOwnerAddress },
    );

    totalGasUsedWithBroker += oracleResponse.receipt.cumulativeGasUsed;

    // Check that a total gas usage is below a certain threshold
    // console.log(`\t\tGas used with Broker: ${totalGasUsedWithBroker}`);

    // ==================
    let totalGasUsedWithDummy = 0;
    const dummy = await artifacts.require('DummyBrokerFront').new({ from: brokerOwnerAddress });

    const sampleDummyOracleBridge = await SampleOracleBridge.new({ from: oracleOwnerAddress });
    await sampleDummyOracleBridge.connectToBrokerFront(
      dummy.address,
      oracleData.oracleTypeId,
      { from: oracleOwnerAddress },
    );
    const sampleDummyProduct = await SampleProduct.new(dummy.address, { from: productOwnerAddress });
    const oracleDummyRequest = await sampleDummyProduct.getRandomNumberUnder(sampleRequestInput,
      { from: productOwnerAddress });

    totalGasUsedWithDummy += oracleDummyRequest.receipt.cumulativeGasUsed;

    const oracleDummyResponse = await sampleDummyOracleBridge.submitResponse(
      web3.utils.fromAscii('AAA'), sampleOracleResponse,
      { from: oracleOwnerAddress },
    );
    totalGasUsedWithDummy += oracleDummyResponse.receipt.cumulativeGasUsed;

    /*
    console.log(`\t\tDifference between Broker and Dummy gas prices:
                  ${totalGasUsedWithBroker - totalGasUsedWithDummy}`);
    */
    (totalGasUsedWithBroker - totalGasUsedWithDummy).should.be.below(gasLimit);
  });

  it('should work with an OraclizeBridge', async () => {
    const oraclizeType = {
      oracleTypeId: 'OraclizeGet',
      callbackSignature: 'string memory _result, bytes memory _proof',
      inputFormat: 'string memory url',
      description: 'Pass an url, receive back a json result and a packaged proof',
    };
    const delayMsPeriod = 2000;
    const retryAttemptsLimit = 20;

    await oracleBrokerFront.proposeOracleType(
      oraclizeType.oracleTypeId,
      oraclizeType.callbackSignature,
      oraclizeType.inputFormat,
      oraclizeType.description,
      emptyAddress,
      { from: productOwnerAddress },
    );
    await oracleTypeRegistry.activateOracleType(
      oraclizeType.oracleTypeId,
      { from: brokerOwnerAddress },
    );

    const oraclizeBridge = await OraclizeBridge.new(oraclizeResolverAddress, {
      from: oracleOwnerAddress,
      value: web3.utils.toWei('5', 'ether'),
    });
    await oraclizeBridge.connectToBrokerFront(
      frontAddress,
      oraclizeType.oracleTypeId,
      { from: oracleOwnerAddress },
    );

    const oracleBridgeTestProduct = await OraclizeBridgeTestProduct.new(frontAddress, { from: productOwnerAddress });

    await oracleBridgeTestProduct.makeRequest(
      'https://api.kraken.com/0/public/Ticker?pair=ETHXBT', 'result.XETHXXBT.c.0',
      { from: productOwnerAddress },
    );

    let resultReceived = false;
    let result;
    let attemptsMade = 0;

    while (!resultReceived && attemptsMade < retryAttemptsLimit) {
      await new Promise(resolve => setTimeout(resolve, delayMsPeriod));
      result = await oracleBridgeTestProduct.getResult.call({ from: productOwnerAddress });
      resultReceived = result.success;
      attemptsMade += 1;
    }

    result.value.should.be.a('string').not.equal('');
  });
});
