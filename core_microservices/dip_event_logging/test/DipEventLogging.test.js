const sinon = require('sinon');
const { fabric } = require('@etherisc/microservice');
const DipEventLogging = require('../DipEventLogging');
const { schema } = require('../knexfile');


describe('DipEventLogging microservice', () => {
  before(async () => {
    this.microservice = fabric(DipEventLogging, {
      amqp: true,
      db: true,
      messageBroker: 'amqp://platform:guest@localhost:5673/trusted',
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
