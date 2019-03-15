const sinon = require('sinon');
const { fabric } = require('@etherisc/microservice');
const FddApi = require('../FddApi');
const { schema, constants } = require('../knexfile');


const POLICY_ID = '82c0754a-6714-435b-84e1-74b6936240eb';

describe('Fdd api microservice', function describe() {
  this.timeout(25000);
  let microservice;
  let db;

  before(async () => {
    microservice = fabric(FddApi, {
      httpDevPort: 3001,
      genericInsurance: true,
      db: true,
      router: true,
      amqp: true,
      log: true,
    });

    await microservice.bootstrap();

    db = microservice.db.getConnection();
  });

  beforeEach(async () => {
    sinon.restore();
    await db.raw(`truncate ${schema}.${constants.POLICY_TABLE} cascade`);
    await db.raw(`truncate ${schema}.${constants.CUSTOMER_TABLE} cascade`);
  });

  after(async () => {
    microservice.shutdown();
  });

  it('should handle LogNewPolicy event', async () => {
    const { Customer, Policy } = microservice.app._db;

    await Customer.query().insertGraph({
      id: '0123456789',
      firstname: 'Firstname',
      lastname: 'Lastname',
      email: 'email@email.com',
      extra: [],
    });

    await Policy.query().insertGraph({
      id: POLICY_ID,
      customerId: '0123456789',
      contractApplicationId: 1,
      contractRequestId: -1,
      contractPolicyId: -1,
      distributorId: '00000000-0000-0000-0000-000000000000',
      extra: [],
    });

    const content = {
      eventName: 'LogNewPolicy',
      eventArgs: {
        applicationId: 1,
        policyId: 1,
      },
    };

    await microservice.app.handleDecodedEvent({ content });

    const policy = await Policy.query().where({ id: POLICY_ID }).first();

    policy.contractApplicationId.should.be.equal(1);
    policy.contractPolicyId.should.be.equal(1);
  });

  it('should handle LogRequestPayment event', async () => {
    const { Customer, Policy } = microservice.app._db;

    await Customer.query().insertGraph({
      id: '0123456789',
      firstname: 'Firstname',
      lastname: 'Lastname',
      email: 'email@email.com',
      extra: [],
    });

    await Policy.query().insertGraph({
      id: POLICY_ID,
      customerId: '0123456789',
      contractApplicationId: 1,
      contractRequestId: -1,
      contractPolicyId: -1,
      distributorId: '00000000-0000-0000-0000-000000000000',
      extra: [],
    });

    const content = {
      eventName: 'LogRequestPayment',
      eventArgs: {
        applicationId: 1,
        requestId: 1,
      },
    };

    await microservice.app.handleDecodedEvent({ content });

    const policy = await Policy.query().where({ id: POLICY_ID }).first();

    policy.contractApplicationId.should.be.equal(1);
    policy.contractRequestId.should.be.equal(1);
  });

  it('should handle LogNewPayout event', async () => {
    const { Customer, Policy } = microservice.app._db;
    sinon.spy(microservice.amqp, 'publish');

    await Customer.query().insertGraph({
      id: '0123456789',
      firstname: 'Firstname',
      lastname: 'Lastname',
      email: 'email@email.com',
      extra: [],
    });

    await Policy.query().insertGraph({
      id: POLICY_ID,
      customerId: '0123456789',
      contractApplicationId: 1,
      contractRequestId: 1,
      contractPolicyId: 1,
      distributorId: '00000000-0000-0000-0000-000000000000',
      extra: [{ field: 'currency', value: 'EUR' }],
    });

    const content = {
      eventName: 'LogNewPayout',
      eventArgs: {
        policyId: '1',
        payoutId: '1',
        amount: '10000',
        state: '0',
      },
    };

    await microservice.app.handleDecodedEvent({ content });

    const spyCall = microservice.amqp.publish.getCall(0);

    const [msg] = spyCall.args;

    msg.messageType.should.be.equal('payout');
    msg.content.provider.should.be.equal('transferwise');
    msg.content.currency.should.be.equal('EUR');
    msg.content.payoutAmount.should.be.equal(10000);
    msg.content.policyId.should.be.equal(POLICY_ID);
    msg.content.contractPayoutId.should.be.equal('1');
  });

  it('should handle ProcessPaymentResult event', async () => {
    const { Customer, Policy } = microservice.app._db;
    sinon.spy(microservice.amqp, 'publish');
    sinon.spy(microservice.app._gif, 'confirmPaymentSuccess');
    sinon.replace(microservice.app, '_contract', () => ({
      methods: {
        confirmPaymentSuccess: () => ({ send: () => { } }),
        confirmPaymentFailure: () => ({ send: () => { } }),
      },
    }));

    await Customer.query().insertGraph({
      id: '0123456789',
      firstname: 'Firstname',
      lastname: 'Lastname',
      email: 'email@email.com',
      extra: [],
    });

    await Policy.query().insertGraph({
      id: POLICY_ID,
      customerId: '0123456789',
      contractApplicationId: 1,
      contractRequestId: 1,
      contractPolicyId: 1,
      distributorId: '00000000-0000-0000-0000-000000000000',
      extra: [{ field: 'currency', value: 'EUR' }],
    });

    const content = {
      policyId: POLICY_ID,
      error: null,
    };

    await microservice.app.handleProcessPaymentResult({ content });

    const spyCall = microservice.app._gif.confirmPaymentSuccess.getCall(0);

    const [contractPolicyId] = spyCall.args;

    contractPolicyId.should.be.equal(1);
  });

  it('should handle ProcessPaymentResult event with error', async () => {
    const { Customer, Policy } = microservice.app._db;
    sinon.spy(microservice.amqp, 'publish');
    sinon.spy(microservice.app._gif, 'handlePaymentFailure');
    sinon.replace(microservice.app, '_contract', () => ({
      methods: {
        confirmPaymentSuccess: () => ({ send: () => { } }),
        confirmPaymentFailure: () => ({ send: () => { } }),
      },
    }));

    await Customer.query().insertGraph({
      id: '0123456789',
      firstname: 'Firstname',
      lastname: 'Lastname',
      email: 'email@email.com',
      extra: [],
    });

    await Policy.query().insertGraph({
      id: POLICY_ID,
      customerId: '0123456789',
      contractApplicationId: 1,
      contractRequestId: 1,
      contractPolicyId: 1,
      distributorId: '00000000-0000-0000-0000-000000000000',
      extra: [{ field: 'currency', value: 'EUR' }],
    });

    const content = {
      policyId: POLICY_ID,
      error: 'Some error',
    };

    await microservice.app.handleProcessPaymentResult({ content });

    const notificationSpyCall = microservice.amqp.publish.getCall(0);
    const [msg] = notificationSpyCall.args;
    msg.messageType.should.be.equal('notification');
    msg.content.type.should.be.equal('charge_error');
    msg.content.props.recipient.should.be.equal('email@email.com');

    const spyCall = microservice.app._gif.handlePaymentFailure.getCall(0);
    const [contractPolicyId] = spyCall.args;
    contractPolicyId.should.be.equal(1);
  });

  it('should handle onCertificateIssued event', async () => {
    const { Customer, Policy } = microservice.app._db;
    sinon.spy(microservice.amqp, 'publish');

    await Customer.query().insertGraph({
      id: '0123456789',
      firstname: 'Firstname',
      lastname: 'Lastname',
      email: 'email@email.com',
      extra: [],
    });

    await Policy.query().insertGraph({
      id: POLICY_ID,
      customerId: '0123456789',
      contractApplicationId: 1,
      contractRequestId: 1,
      contractPolicyId: 1,
      distributorId: '00000000-0000-0000-0000-000000000000',
      extra: [{ field: 'currency', value: 'EUR' }],
    });

    const content = {
      policyId: POLICY_ID,
      bucket: 'TEST_BUCKET',
      path: 'TEST_PATH',
    };

    await microservice.app.onCertificateIssued({ content });

    const notificationSpyCall = microservice.amqp.publish.getCall(0);
    const [msg] = notificationSpyCall.args;
    msg.messageType.should.be.equal('notification');
    msg.content.type.should.be.equal('policy_issued');
    msg.content.props.recipient.should.be.equal('email@email.com');

    const [attachment] = msg.content.props.attachments;
    attachment.bucket.should.be.equal('TEST_BUCKET');
    attachment.path.should.be.equal('TEST_PATH');
    attachment.type.should.be.equal('application/pdf');
    attachment.name.should.be.equal('certificate.pdf');
  });
});
