const WebSocket = require('ws');
const amqp = require('amqplib');
const knex = require('knex');
const stripe = require('stripe')('sk_test_55VxCBH8ygdTUGbta0jAiIJk');


const tables = [
  'policy_storage.customer',
  'policy_storage.customer_extra',
  'policy_storage.distributor',
  'policy_storage.policy',
  'policy_storage.policy_extra',
];

describe('Etherisc Flight Delay API', () => {
  before(async () => {
    this.db = knex({
      client: 'pg',
      connection: {
        host: process.env.POSTGRES_SERVICE_HOST || 'localhost',
        user: process.env.POSTGRES_USER || 'postgresql',
        password: process.env.POSTGRES_PASSWORD || 'postgresql',
        database: process.env.POSTGRES_DB || 'postgresql',
      },
    });
  });

  beforeEach(async () => {
    await Promise.all(tables.map(t => this.db.raw(`truncate ${t} cascade`)));
    await this.db('policy_storage.distributor').insert([
      {
        id: '11111111-1111-1111-1111-111111111111',
        company: 'Etherisc',
      },
    ]);
  });

  after(async () => {
    this.db.destroy();
  });

  it('should establish WebSocket connection', (done) => {
    const ws = new WebSocket('ws://localhost:8080/api/ws');

    ws.on('message', (message) => {
      const { msg } = JSON.parse(message);

      msg.should.be.equal('WebSocket connection successfully established');

      ws.close();
      done();
    });
  });

  it('sequence of messages after form apply should be correct', async () => {
    const ws = new WebSocket('ws://localhost:8080/api/ws');
    await new Promise(resolve => ws.on('open', resolve));

    const connection = await amqp.connect('amqp://platform:guest@localhost:5672/trusted'); // TODO: connect through ENV vars
    const channel = await connection.createChannel();

    const q = await channel.assertQueue('platform_test_queue', { exclusive: false }); // TODO: use amqp from microservice lib
    await channel.bindQueue(q.queue, 'EXCHANGE', '#');

    const messages = [];

    const source = await stripe.sources.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 2039,
        cvc: '123',
      },
    });

    const form = {
      customer: {
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'test@test.com',
      },
      policy: {
        distributorId: '11111111-1111-1111-1111-111111111111',
        from: 'SFO',
        to: 'SRH',
        date: '2018-12-20',
      },
      payment: {
        kind: 'fiat',
        currency: 'usd',
        premium: 1500,
        provider: 'stripe',
        sourceId: source.id,
      },
    };

    await new Promise((resolve) => {
      channel.consume(q.queue, (message) => {
        const data = {
          routingKey: message.fields.routingKey,
          content: JSON.parse(message.content.toString()),
        };

        console.log(data);

        messages.push(data);
      }, { noAck: true });

      ws.send(JSON.stringify({
        type: 'apply',
        data: form,
      }));

      setTimeout(() => {
        resolve();
      }, 20000);
    });

    await channel.close();
    await connection.close();
    ws.close();

    const { policyId } = messages.filter(m => m.routingKey === 'dip_policy_storage.policyCreationSuccess.1.0')[0].content;
    const { customerId } = messages.filter(m => m.routingKey === 'dip_policy_storage.initializePayment.1.0')[0].content.customer;

    const expected = [
      {
        routingKey: 'etherisc_flight_delay_api.policyCreationRequest.1.0',
        content: form,
      },
      {
        routingKey: 'dip_policy_storage.initializePayment.1.0',
        content: {
          policyId,
          customer: {
            customerId,
            ...form.customer,
          },
          payment: form.payment,
        },
      },
      {
        routingKey: 'dip_fiat_payment_gateway.initializePaymentResult.1.0',
        content: { policyId },
      },
      {
        routingKey: 'dip_policy_storage.policyCreationSuccess.1.0',
        content: { policyId },
      },
      {
        routingKey: 'dip_ethereum_client.transactionCreated.1.0',
        content: { policyId },
      },
      {
        routingKey: 'dip_ethereum_client.stateChanged.1.0',
        content: { policyId, state: 0 },
      },
      {
        routingKey: 'dip_ethereum_client.stateChanged.1.0',
        content: { policyId, state: 1 },
      },
      {
        routingKey: 'etherisc_flight_delay_api.processPayment.1.0',
        content: { policyId },
      },
      {
        routingKey: 'dip_fiat_payment_gateway.processPaymentResult.1.0',
        content: { policyId },
      },
      {
        routingKey: 'etherisc_flight_delay_api.issueCertificate.1.0',
        content: { policyId },
      },
      {
        routingKey: 'dip_pdf_generator.policyGetRequest.1.0',
        content: { policyId },
      },
      {
        routingKey: 'dip_pdf_generator.certificateIssued.1.0',
        content: { policyId },
      },
      {
        routingKey: 'dip_ethereum_client.stateChanged.1.0',
        content: { policyId, state: 3 },
      },
      {
        routingKey: 'etherisc_flight_delay_api.payout.1.0',
        content: { policyId },
      },
      {
        routingKey: 'dip_fiat_payout_gateway.paidOut.1.0',
        content: { policyId },
      },
    ];

    messages.should.be.containDeepOrdered(expected);
  }).timeout(25000);
});
