require('../setup');


const OracleRequestRegistry = artifacts.require('OracleRequestRegistry');

contract('OracleRequestRegistry', (accounts) => {
  let oracleRequestRegistry;
  const sampleOracleType = 'SampleOracleType';
  const sampleInternalId = web3.utils.fromAscii('SampleInternalId');

  const [registryOwner, productAddress, frontAddress, oracleAddress] = accounts;

  beforeEach(async () => {
    oracleRequestRegistry = await OracleRequestRegistry.new(frontAddress, { from: registryOwner });
    // simulate broker front with account #3, account #1 is an owner
  });

  it('should store the incoming request', async () => {
    let requestId = '';
    const result = await oracleRequestRegistry.makeRequest(
      sampleOracleType,
      sampleInternalId,
      web3.eth.abi.encodeParameter('string', ''),
      productAddress,
      'callbackMethod',
      oracleAddress,
      {
        from: frontAddress,
      },
    );

    result.logs.forEach((log) => {
      if (log.event === 'RequestRegistered') {
        requestId = log.args.id;
      }
    });

    const storedRequest = await oracleRequestRegistry.getRequestPayload.call(requestId, { from: frontAddress });

    storedRequest.oracleType.should.equal(sampleOracleType);
  });


  /*
     it('should ...', async () => {

     });
     */
});
