const uuid = require('uuid');
const { fabric } = require('@etherisc/microservice');
const { deleteTestExchange, deleteTestBucket } = require('@etherisc/microservice/test/helpers');
const DipArtifactsStorage = require('../DipArtifactsStorage');
const { schema } = require('../knexfile');


const exchangeName = uuid();

describe('DipArtifactsStorage microservice', () => {
  before(async () => {
    this.microservice = fabric(DipArtifactsStorage, {
      httpPort: 4000,
      bucket: uuid(),
      exchangeName,
    });
    await this.microservice.bootstrap();

    this.amqp = this.microservice.amqp;
    this.db = this.microservice.db.getConnection();
    this.s3 = this.microservice.s3;
  });

  beforeEach(async () => {
    await this.db(`${schema}.artifacts`).truncate();
  });

  after(async () => {
    await deleteTestExchange(this.amqp, exchangeName);
    await deleteTestBucket(this.s3.client, this.microservice.config.bucket);
    this.microservice.shutdown();
  });

  it('saveArtifact should add artifacts to s3', async () => {
    await this.amqp.publish({
      messageType: 'contractDeployment',
      messageVersion: '1.*',
      content: {
        product: 'product',
        network: 'network',
        version: 'version',
        artifact: '{"contractName":"Test","abi":[{"name":"E1"}],"networks":{"4447":{"address":"0x345ca3e014aaf5dca488057592ee47305d9b3e10"}}}',
      },
    });

    let artifacts = await this.s3.getArtifacts('product', 'network');
    while (artifacts.length === 0) {
      artifacts = await this.s3.getArtifacts('product', 'network');
    }
    artifacts[0].content.abi[0].name.should.be.equal('E1');
  });

  it('saveArtifact should add abi to db', async () => {
    await this.amqp.publish({
      messageType: 'contractDeployment',
      messageVersion: '1.*',
      content: {
        product: 'product',
        network: 'network',
        version: 'version',
        artifact: '{"contractName":"Test","abi":[{"name":"E1"}],"networks":{"4447":{"address":"0x345ca3e014aaf5dca488057592ee47305d9b3e10"}}}',
      },
    });

    let result = await this.db.raw(`SELECT * FROM ${schema}.artifacts`);
    while (result.rows.length === 0) {
      result = await this.db.raw(`SELECT * FROM ${schema}.artifacts`);
    }
    result.rows[0].abi[0].name.should.be.equal('E1');
  });
});
