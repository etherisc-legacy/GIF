const uuid = require('uuid');
const sinon = require('sinon');
const { fabric } = require('@etherisc/microservice');
const { deleteTestExchange } = require('@etherisc/microservice/test/helpers');
const DipEventLogging = require('../DipEventLogging');
const { schema } = require('../knexfile');


const exchangeName = uuid();

describe('DipEventLogging microservice', () => {
  before(async () => {
    this.microservice = fabric(DipEventLogging, {
      amqp: true,
      db: true,
      exchangeName,
    });
    await this.microservice.bootstrap();

    this.amqp = this.microservice.amqp;
    this.db = this.microservice.db.getConnection();

    await new Promise(resolve => setTimeout(resolve, 100));
  });

  beforeEach(async () => {
    sinon.restore();
    await this.db(`${schema}.events`).truncate();
  });

  after(async () => {
    await deleteTestExchange(this.amqp, exchangeName);
    this.microservice.shutdown();
  });

  it('saves the AMQP messages to DB', async () => {
    await this.amqp.publish({
      messageType: 'policyCreationError',
      content: { message: 'Test message' },
    });
    await new Promise(resolve => setTimeout(resolve, 100));
    const eventCounts = await this.db(`${schema}.events`).count();

    eventCounts[0].count.should.be.equal('1');
  });
});
