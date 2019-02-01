const uuid = require('uuid');
const moment = require('moment');
const _ = require('lodash');


const applyPolicySchema = {
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    amount: { type: 'integer', exclusiveMinimum: 0 },
    carrier: { type: 'string' },
    flightNumber: { type: 'string' },
    origin: { type: 'string' },
    destination: { type: 'string' },
    departsAt: { type: 'string' },
    arrivesAt: { type: 'string' },
    currency: { type: 'string' },
    ethereumAccountId: { type: 'string' },
    stripeSourceId: { type: 'string' },
    couponCode: { type: 'string' },
    txHash: { type: 'string' },
    payouts: {
      type: 'object',
      properties: {
        p1: { type: 'string' },
        p2: { type: 'string' },
        p3: { type: 'string' },
        p4: { type: 'string' },
        p5: { type: 'string' },
      },
    },
  },
  required: ['firstName', 'lastName', 'email', 'carrier', 'flightNumber', 'departsAt', 'arrivesAt', 'origin',
    'destination', 'amount', 'currency', 'payouts'],
  dependencies: {
    ethereumAccountId: {
      properties: { currency: { type: 'string', enum: ['eth'] } },
    },
    txHash: {
      properties: { currency: { type: 'string', enum: ['eth'] } },
    },
    stripeSourceId: {
      properties: {
        currency: { type: 'string', enum: ['usd', 'eur', 'gbp'] },
      },
    },
  },
  oneOf: [
    { required: ['ethereumAccountId'] },
    { required: ['stripeSourceId'] },
  ],
  additionalProperties: false,
};

const createPolicySchema = {
  properties: {
    txHash: { type: 'string' },
  },
  required: ['txHash'],
  additionalProperties: false,
};

const checkPolicyJobSchema = {
  properties: {
    txHash: { type: 'string' },
  },
  required: ['txHash'],
  additionalProperties: false,
};

const policyPayoutsSchema = {
  type: 'array',
  items: [
    { type: 'string', format: 'uuid' },
  ],
};

module.exports = ({
  router,
  ajv,
  db,
  log,
  gif,
  signer,
}) => {
  router.post('/api/policies', async (ctx) => {
    const { body } = ctx.request;
    const validate = ajv.compile(applyPolicySchema);

    log.info(body);

    if (!validate(body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    try {
      const customer = {
        firstname: body.firstName,
        lastname: body.lastName,
        email: body.email,
      };

      const policy = {
        distributorId: '11111111-1111-1111-1111-111111111111',
        carrier: body.carrier,
        departsAt: body.departsAt,
        arrivesAt: body.arrivesAt,
        origin: body.origin,
        destination: body.destination,
        flightNumber: body.flightNumber,
      };

      const payment = {
        kind: 'fiat',
        premium: body.amount,
        currency: body.currency,
        provider: 'stripe',
        sourceId: body.stripeSourceId,
      };

      const { payouts } = body;

      const { policyId, customerId } = await gif.policyCreationRequest({
        creationId: uuid(),
        customer,
        policy,
        payment,
      });

      const { Policy, Customer } = db;

      // Check if customer exists
      const customerExists = await Customer.query().where('id', customerId).first();

      // Create customer if it doesn't exists
      if (!customerExists) {
        await Customer.query().insertGraph({
          id: customerId,
          ..._.pick(customer, ['firstname', 'lastname', 'email']),
          extra: [
            ..._.map(
              _.toPairs(_.omit(customer, ['firstname', 'lastname', 'email'])),
              ([field, value]) => ({ field, value }),
            ),
          ],
        });
      }

      await Policy.query().insertGraph({
        id: policyId,
        customerId,
        ..._.pick(policy, ['distributorId']),
        extra: [
          ..._.map(
            _.toPairs(_.omit(policy, ['distributorId'])),
            ([field, value]) => ({ field, value }),
          ),
        ],
      });

      const application = {
        carrierFlightNumber: signer.utils.asciiToHex(`${policy.carrier}/${policy.flightNumber}`),
        yearMonthDay: signer.utils.asciiToHex(moment(policy.departsAt).format('YYYY/MM/DD')),
        departureTime: moment(policy.departsAt).unix(),
        arrivalTime: moment(policy.arrivesAt).unix(),
        premium: payment.premium,
        currency: signer.utils.asciiToHex('EUR'), // payment.currency,
        payoutOptions: [
          Number((Number(payouts.p1) * 100).toFixed(0)),
          Number((Number(payouts.p2) * 100).toFixed(0)),
          Number((Number(payouts.p3) * 100).toFixed(0)),
          Number((Number(payouts.p4) * 100).toFixed(0)),
          Number((Number(payouts.p5) * 100).toFixed(0)),
        ],
        customerExternalId: signer.utils.padRight(signer.utils.utf8ToHex(policyId), 34).substr(0, 34),
      };

      log.info(application);

      const { transactionHash } = await gif.applyForPolicy(application);

      await gif.issueCertificate(policyId);

      ctx.ok({ customerId, policyToken: policyId, txHash: transactionHash });
    } catch (error) {
      log.error(error);
      ctx.badRequest(error);
    }
  });

  router.post('/api/policies/create', async (ctx) => {
    const validate = ajv.compile(createPolicySchema);

    if (!validate(ctx.request.body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    // const { txHash } = ctx.request.body;
    // await createPolicyService.startPolicyCreationProcess(txHash)

    ctx.ok({ status: 'JobCreated' });

    // createPolicyService
    //   .executePolicyCreationProcess(txHash)
    //   .catch(console.log)
  });

  router.post('/api/policies/checkPolicyJob', async (ctx) => {
    const validate = ajv.compile(checkPolicyJobSchema);

    if (!validate(ctx.request.body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    // const { txHash } = ctx.request.body
    // const result = await createPolicyService.checkPolicyJob(txHash)

    // ctx.ok(result);
    ctx.ok({ flowStatus: 'Pending' });
  });

  router.get('/api/policies/:id', async (ctx) => {
    // const id = ctx.params.id

    // const certificate = await policyService.getPolicy(id)

    // if (!certificate) {
    //   ctx.notFound()
    //   return
    // }

    // ctx.body = certificate
    ctx.ok();
  });

  router.get('/api/customers/:id/policies', async (ctx) => {
    const customerId = ctx.params.id;

    const policies = await db.Policy.query().where({ customerId });

    ctx.ok(policies);
  });

  router.post('/api/policies/payouts', async (ctx) => {
    const validate = ajv.compile(policyPayoutsSchema);

    if (!validate(ctx.request.body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    // const policyIds = ctx.request.body
    // const payouts = await policyService.getAllPayouts(policyIds)

    // ctx.ok(payouts)
    ctx.ok();
  });
};
