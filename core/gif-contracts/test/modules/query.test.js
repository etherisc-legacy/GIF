const { web3utils } = require('../../io/module')(web3, artifacts);


const DAOService = artifacts.require('services/DAOService.sol');
const OracleService = artifacts.require('services/OracleService.sol');
const ProductService = artifacts.require('services/ProductService.sol');
const OracleOwnerService = artifacts.require('services/OracleOwnerService.sol');
const TestOracle = artifacts.require('examples/TestOracle/TestOracle.sol');
const TestProduct = artifacts.require('examples/TestOracle/TestProduct.sol');

contract('Query module', () => {
  /*
  it('query module should be registered as "query" contract', async () => {});

  /!* OracleType *!/

  /!* proposeOracleType *!/
  it('proposeOracleType should create inactive but initialized OracleType record', async () => {});
  it('proposeOracleType should be restricted to calls only from OracleOwnerService', async () => {});
  it('proposeOracleType should throw if OracleType has already initialized', async () => {});

  /!* activateOracleType *!/
  it('activateOracleType should switch OracleType to active state', async () => {});
  it('activateOracleType should be restricted to calls only from DAOService', async () => {});
  it('activateOracleType should throw is OracleType is in active state', async () => {});
  it('activateOracleType should throw if OracleType not exists', async () => {});

  /!* deactivateOracleType *!/
  it('deactivateOracleType should switch OracleType to inactive state', async () => {});
  it('deactivateOracleType should be restricted to calls only from DAOService', async () => {});
  it('deactivateOracleType should throw if OracleType not exists', async () => {});
  it('deactivateOracleType should throw is OracleType is not in active state', async () => {});
  it('deactivateOracleType should throw is OracleType has assigned oracles', async () => {});

  /!* removeOracleType *!/
  it('removeOracleType should remove OracleType record', async () => {});
  it('deactivateOracleType should be restricted to calls only from DAOService', async () => {});
  it('removeOracleType should throw if OracleType not exists', async () => {});
  it('removeOracleType should throw is OracleType is in active state', async () => {});
  it('removeOracleType should throw is OracleType has assigned oracles', async () => {});

  /!* Oracle *!/

  /!* proposeOracle *!/
  it('proposeOracle should create Oracle record in inactive state', async () => {});
  it('proposeOracle should be restricted to calls only from OracleOwnerService', async () => {});
  it('proposeOracle should throw if oracle exists', async () => {});

  /!* revokeOracleProposal *!/
  it('revokeOracleProposal should remove Oracle proposal record', async () => {});
  it('revokeOracleProposal should be restricted to calls only from OracleOwnerService', async () => {});

  /!* updateOracleContract *!/
  it('updateOracleContract should update Oracle with new contract address', async () => {});
  it('updateOracleContract should be restricted to calls only from OracleOwnerService', async () => {});

  /!* activateOracle *!/
  it('activateOracle switch Oracle in active state', async () => {});
  it('activateOracle should be restricted to calls only from DAOService', async () => {});
  it('should throw if Oracle does not exists', async () => {});
  it('should throw if Oracle is in active state', async () => {});

  /!* deactivateOracle *!/
  it('deactivateOracle should switch Oracle in inactive state', async () => {});
  it('deactivateOracle should be restricted to calls only from DAOService', async () => {});
  it('should throw if Oracle does not exists', async () => {});
  it('should throw if Oracle is not in active state', async () => {});
  it('should throw if Oracle is assigned to OracleTypes', async () => {});

  /!* removeOracle *!/
  it('removeOracle should remove Oracle record', async () => {});
  it('removeOracle should be restricted to calls only from DAOService', async () => {});
  it('should throw if Oracle does not exists', async () => {});
  it('should throw if Oracle is not in active state', async () => {});
  it('should throw if Oracle is assigned to OracleTypes', async () => {});

  /!* Oracle-OracleType *!/

  /!* proposeOracleToType *!/
  it('proposeOracleToType should create Oracle to OracleType proposal record ', async () => {});
  it('proposeOracleToType should be restricted to calls only from OracleOwnerService', async () => {});
  it('proposeOracleToType should throw if called is not Oracle owner', async () => {});
  it('proposeOracleToType should throw if Oracle does not exists', async () => {});
  it('proposeOracleToType should throw if OracleType does not exists', async () => {});

  /!* revokeOracleToTypeProposal *!/
  it('revokeOracleToTypeProposal should remove Oracle to OracleType proposal record', async () => {});
  it('revokeOracleToTypeProposal should be restricted to calls only from OracleOwnerService', async () => {});
  it('proposeOracleToType should throw if called is not Oracle owner', async () => {});
  it('proposeOracleToType should throw if Oracle does not exists', async () => {});
  it('proposeOracleToType should throw if OracleType does not exists', async () => {});

  /!* assignOracleToOracleType *!/
  it('assignOracleToOracleType should bind Oracle to OracleType', async () => {});
  it('assignOracleToOracleType should be restricted to calls only from DAOService', async () => {});
  it('assignOracleToOracleType should throw if OracleType doest not exits', async () => {});

  /!* removeOracleFromOracleType *!/
  it('removeOracleFromOracleType should remove Oracle from OracleType', async () => {});
  it('removeOracleFromOracleType should be restricted to calls only from DAOService', async () => {});
  it('removeOracleFromOracleType should throw if Oracle does not assigned to OracleType', async () => {});

  /!* Request *!/

  /!* 1->1 request *!/
  it('request should take product request and send it to oracle', async () => {});
  it('request should be restricted to calls only from ProductService', async () => {});
  it('proposeOracleToType should throw if Oracle does not exists', async () => {});
  it('proposeOracleToType should throw if OracleType does not exists', async () => {});
  it('request should throw if responsible oracle does not assigned to OracleType', async () => {});

  /!* Respond *!/
  it('respond should take oracle response and send it to product', async () => {});
  it('respond should be restricted to calls only from OracleService', async () => {});
  it('should throw if responder is not responsible Oracle', async () => {});
  */

  it('should throw if one response was already received', async () => {
    const daoService = await DAOService.deployed();
    const productService = await ProductService.deployed();
    const oracleService = await OracleService.deployed();
    const oracleOwnerService = await OracleOwnerService.deployed();

    // Deploy TestOracle
    const testOracle = await TestOracle.new(
      oracleService.address, {
        gas: 4000000,
      },
    );

    // Deploy TestProduct
    const testProduct = await TestProduct.new(
      productService.address, {
        gas: 4000000,
      },
    );

    // Approve product
    await daoService.approveProduct(3, { gas: 200000 });

    const oracleTypeName = web3utils.bytes(32, 'Test');

    // Propose OracleType
    await oracleOwnerService.proposeOracleType(oracleTypeName, '(uint256)', '(uint256)', 'Test oracle',
      { gas: 300000 });

    // Activate Test OracleType
    await daoService.activateOracleType(oracleTypeName, { gas: 200000 });

    // Propose TestOracle as oracle
    await oracleOwnerService.proposeOracle(testOracle.address, 'Test oracle', { gas: 200000 });

    // Activate Test Oracle
    const oracleId = 2;
    await daoService.activateOracle(oracleId, { gas: 200000 });

    // Propose TestOracle to Test OracleType
    await oracleOwnerService.proposeOracleToType(oracleTypeName, oracleId, { gas: 200000 });

    // Assign TestOracle to Test OracleType
    const proposalId = 0;
    await daoService.assignOracleToOracleType(oracleTypeName, proposalId, { gas: 200000 });

    await testProduct.makeRequest(3);

    const requestId = (await testOracle.requestId()).toNumber();

    await testOracle.publicRespond(requestId, 1);
    testOracle.publicRespond(requestId, 2)
      .should.be.rejectedWith('ERROR::ORACLE_RESPONSE_ALREADY_RECEIVED');
  });
});
