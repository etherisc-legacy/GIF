const { fabric } = require('@etherisc/microservice');
const _ = require('lodash');
const DipPolicyStorage = require('../DipPolicyStorage');


describe('DipPolicyStorage microservice', () => {
  before(async () => {
    this.microservice = fabric(DipPolicyStorage, { httpPort: 4000 });
    await this.microservice.bootstrap();

    this.amqp = this.microservice.amqp;
    this.db = this.microservice.db.getConnection();
    this.http = this.microservice.http;

    await new Promise(resolve => setTimeout(resolve, 500));
  });

  beforeEach(async () => {
    await this.db.migrate.rollback();
    await this.db.migrate.latest();
  });

  after(async () => {
    await this.db.migrate.rollback();
    await this.db.migrate.latest();

    this.microservice.amqp.shutdown();
    this.microservice.db.shutdown();
    this.microservice.http.shutdown();
  });

  it('onPolicyCreateMessage should create policy and new customer if it does not exists', async () => {
    const data = {
      customer: {
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'email@email.com',
        gender: 'male',
      },
      policy: {
        distributorId: '11111111-1111-1111-1111-111111111111',
        vendorCode: '123',
        product: 'Macbook Pro',
        price: '1000',
        currency: 'usd',
      },
    };

    const message = {
      content: JSON.stringify(data),
      routingKey: 'policy.create.v1',
      correlationId: '1',
    };

    await this.microservice.app.onPolicyCreateMessage(message);

    const {
      Customer, Policy, CustomerExtra, PolicyExtra,
    } = this.microservice.app.models;

    // Check customer
    const customerId = this.microservice.app.generateCustomerId('firstname', 'lastname', 'email@email.com');
    const customer = await Customer.query();

    customer.length.should.be.equal(1);
    _.omit(customer[0], ['created', 'updated']).should.be.deepEqual({
      id: customerId,
      firstname: data.customer.firstname,
      lastname: data.customer.lastname,
      email: data.customer.email,
    });

    // Check customer extra
    const customerExtra = await CustomerExtra.query();

    customerExtra.length.should.be.equal(1);
    _.map(customerExtra, el => _.omit(el, ['created', 'updated', 'id'])).should.be.deepEqual([
      { field: 'gender', value: 'male', customerId },
    ]);

    // Check policy
    const policy = await Policy.query();

    policy.length.should.be.equal(1);
    _.omit(policy[0], ['created', 'updated', 'id']).should.be.deepEqual({
      customerId,
      distributorId: data.policy.distributorId,
    });

    // Check policy extra
    const policyExtra = await PolicyExtra.query();
    policyExtra.length.should.be.equal(4);

    const policyId = policy[0].id;

    _.map(policyExtra, el => _.omit(el, ['created', 'updated', 'id'])).should.be.deepEqual([
      { field: 'vendorCode', value: '123', policyId },
      { field: 'product', value: 'Macbook Pro', policyId },
      { field: 'price', value: '1000', policyId },
      { field: 'currency', value: 'usd', policyId },
    ]);
  });
});
