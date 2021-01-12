require('dotenv').config();
const sinon = require('sinon');
const { fabric } = require('@etherisc/microservice');
const FiatPayoutGateway = require('../FiatPayoutGateway');
const { schema, constants } = require('../knexfile');


const requiredEnv = ['TRANSFERWISE_SRC_CURRENCY', 'TRANSFERWISE_PROFILE_ID', 'TRANSFERWISE_API_URL',
  'TRANSFERWISE_API_TOKEN', 'TRANSFERWISE_LOGIN', 'TRANSFERWISE_PASSWORD'];

const POLICY_ID = '82c0754a-6714-435b-84e1-74b6936240eb';

describe('FiatPayoutGateway microservice', () => {
  before(async () => {
    this.microservice = fabric(FiatPayoutGateway, {
      amqp: true,
      db: true,
      messageBroker: 'amqp://platform:guest@localhost:5673/trusted',
      appName: process.env.APP_NAME,
      appVersion: process.env.APP_VERSION,
      requiredEnv,
    });
    await this.microservice.bootstrap();

    this.amqp = this.microservice.amqp;
    this.db = this.microservice.db.getConnection();

    await new Promise(resolve => setTimeout(resolve, 100));
  });

  beforeEach(async () => {
    sinon.restore();
    await this.db(`${schema}.${constants.PAYOUT_TABLE}`).truncate();
  });

  after(async () => {
    this.microservice.shutdown();
  });

  it('should create new payout and send policyGetRequest message', async () => {
    const payoutMsg = {
      policyId: POLICY_ID,
      payoutAmount: 100,
      currency: 'EUR',
      provider: 'transferwise',
    };

    sinon.replace(this.amqp, 'publish', (msg) => {
      const {
        messageType,
        content,
        correlationId,
      } = msg;

      messageType.should.be.equal('policyGetRequest');
      content.policyId.should.be.equal(POLICY_ID);
      correlationId.should.be.equal(0);

      return Promise.resolve();
    });

    await this.microservice.app.handlePayout({ content: payoutMsg, properties: { correlationId: 0 } });
  });

  it('should send payoutError message', async () => {
    const payoutMsg = {
      policyId: POLICY_ID,
      payoutAmount: 100,
      currency: 'EUR',
      provider: 'not_valid_provider',
    };

    sinon.replace(this.amqp, 'publish', (msg) => {
      const {
        messageType,
        content,
        correlationId,
      } = msg;

      messageType.should.be.equal('payoutError');
      content.policyId.should.be.equal(POLICY_ID);
      content.error.should.be.equal('Payout provider not_valid_provider not found');
      correlationId.should.be.equal(0);

      return Promise.resolve();
    });

    await this.microservice.app.handlePayout({ content: payoutMsg, properties: { correlationId: 0 } });
  });

  it('should do payout', async () => {
    const payoutMsg = {
      policyId: POLICY_ID,
      payoutAmount: 100,
      currency: 'EUR',
      provider: 'transferwise',
    };

    sinon.replace(this.amqp, 'publish', async (msg) => {
      const {
        messageType,
        content,
        correlationId,
      } = msg;

      if (messageType === 'paidOut') {
        content.policyId.should.be.equal(POLICY_ID);
        correlationId.should.be.equal(0);
        return;
      }

      messageType.should.be.equal('policyGetRequest');
      content.policyId.should.be.equal(POLICY_ID);
      correlationId.should.be.equal(0);

      const policyGetResponseMsg = {
        id: 1,
        customer: {
          firstname: 'firstname',
          lastname: 'lastname',
          email: 'email@email.com',
        },
      };

      await this.microservice.app.policyGetResponse({
        content: policyGetResponseMsg,
        properties: { correlationId: 0 },
      });
    });

    sinon.replace(this.microservice.app.providers.get('transferwise'), 'initializePayout', (payoutInfo) => {
      payoutInfo.name.should.be.equal('firstname lastname');
      payoutInfo.email.should.be.equal('email@email.com');
      payoutInfo.currency.should.be.equal('EUR');
      payoutInfo.amount.should.be.equal(100);
      return Promise.resolve({ id: 123 });
    });

    sinon.replace(this.microservice.app.providers.get('transferwise'), 'processPayout', ({ id }) => {
      id.should.be.equal(123);
      return Promise.resolve();
    });

    await this.microservice.app.handlePayout({ content: payoutMsg, properties: { correlationId: 0 } });
  });
});
