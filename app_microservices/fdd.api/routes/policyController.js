const uuid = require('uuid');


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
  },
  required: ['firstName', 'lastName', 'email', 'carrier', 'flightNumber', 'departsAt', 'arrivesAt', 'origin',
    'destination', 'amount', 'currency'],
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
  messageBus,
  ajv,
  amqp,
  db,
  log,
}) => {
  router.post('/api/policies', async (ctx) => {
    const { body } = ctx.request;
    const validate = ajv.compile(applyPolicySchema);

    if (!validate(body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    try {
      const theCreationId = uuid();

      await amqp.publish({
        messageType: 'policyCreationRequest',
        messageVersion: '1.*',
        content: {
          creationId: theCreationId,
          customer: {
            firstname: body.firstName,
            lastname: body.lastName,
            email: body.email,
          },
          policy: {
            distributorId: '11111111-1111-1111-1111-111111111111',
            carrier: body.carrier,
            departsAt: body.departsAt,
            arrivesAt: body.arrivesAt,
            origin: body.origin,
            destination: body.destination,
            flightNumber: body.flightNumber,
          },
          payment: {
            kind: 'fiat',
            premium: body.amount,
            currency: body.currency,
            provider: 'stripe',
            sourceId: body.stripeSourceId,
          },
        },
      });

      await new Promise((resolve) => {
        // eslint-disable-next-line require-jsdoc
        function onPolicyCreationSuccess({ creationId, policyId, customerId }) {
          if (creationId !== theCreationId) { return; }
          // eslint-disable-next-line no-use-before-define
          removeListeners();
          ctx.ok({ customerId, policyToken: 1, txHash: '12345' });
          resolve();
        }

        // eslint-disable-next-line require-jsdoc
        function onPolicyCreationError({ creationId, error }) {
          if (creationId !== theCreationId) { return; }
          // eslint-disable-next-line no-use-before-define
          removeListeners();
          ctx.badRequest(error);
          resolve();
        }

        // eslint-disable-next-line require-jsdoc
        function removeListeners() {
          messageBus.removeListener('policyCreationSuccess', onPolicyCreationSuccess);
          messageBus.removeListener('policyCreationError', onPolicyCreationError);
        }

        messageBus.on('policyCreationSuccess', onPolicyCreationSuccess);
        messageBus.on('policyCreationError', onPolicyCreationError);
      });
    } catch (error) {
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
