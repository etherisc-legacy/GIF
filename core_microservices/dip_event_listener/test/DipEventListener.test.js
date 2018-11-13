const uuid = require('uuid');
const sinon = require('sinon');
const { fabric } = require('@etherisc/microservice');
const { deleteTestExchange, deleteTestBucket } = require('@etherisc/microservice/test/helpers');
const DipEventListener = require('../DipEventListener');
const { schema } = require('../knexfile');


describe('DipEventListener microservice', () => {
  before(async () => {
    this.microservice = fabric(DipEventListener, {
      amqp: true,
      db: true,
      s3: true,
      httpPort: 4000,
      rpcNode: process.env.WS_PROVIDER || 'ws://localhost:8545',
      networkName: process.env.NETWORK_NAME || 'development',
      exchangeName: 'test_listener',
      bucket: uuid(),
    });
    await this.microservice.bootstrap();

    this.amqp = this.microservice.amqp;
    this.db = this.microservice.db.getConnection();
    this.http = this.microservice.http;
    this.s3 = this.microservice.s3;
  });

  beforeEach(async () => {
    sinon.restore();
    await this.db(`${schema}.contracts`).truncate();
    await this.db(`${schema}.events`).truncate();
  });

  after(async () => {
    await deleteTestExchange(this.amqp, 'test_listener'); // todo: use uuid
    await deleteTestBucket(this.s3.client, this.microservice.config.bucket);
    this.microservice.shutdown();
  });

  it('handleEvent should publish decoded event', async () => {
    await this.db.raw(`INSERT INTO ${schema}.contracts (product, "networkName", version, address, abi) VALUES ('product', '${this.microservice.app.networkName}', '1.0.0', '0x345ca3e014aaf5dca488057592ee47305d9b3e10', '[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":true,"name":"value","type":"uint256"}],"name":"E1","type":"event"},{"constant":false,"inputs":[],"name":"AddEvent","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"Suicide","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]')`);
    sinon.replace(this.microservice.app.web3.eth, 'getBlock', sinon.fake.returns({ timestamp: 1539267039 }));

    await new Promise(async (resolve) => {
      await this.amqp.consume({
        messageType: 'decodedEvent',
        messageVersion: '1.*',
        handler: ({ content, fields, properties }) => {
          content.eventArgs.value.should.be.equal('0');
          resolve();
        },
      });

      await this.microservice.app.handleEvent({
        logIndex: 0,
        transactionIndex: 0,
        transactionHash: '0x387905a4404da0410e6dc70ec0e4ad33702e73cc0c8e1b17f31ce3245efcf968',
        blockHash: '0x5187cb19ecb4e8a639fd4db05f5c05ab4e08696cebc2c68d91bda32beceb022c',
        blockNumber: 3,
        address: '0x345cA3e014Aaf5dcA488057592ee47305D9B3e10',
        data: '0x00',
        topics:
          ['0x39be10caf08413c53cba369135da2b641931c99ac27b0d821e26f3ec4e0c63d2',
            '0x000000000000000000000000627306090abab3a6e1400e9345bc60c78a8bef57',
            '0x0000000000000000000000000000000000000000000000000000000000000000'],
        type: 'mined',
        id: 'log_79204e1d',
      });
    });
  });
});
