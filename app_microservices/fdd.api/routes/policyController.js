const uuid = require('uuid');
const { utils } = require('web3');
const moment = require('moment');
const _ = require('lodash');

/**
 * To money format
 * @param {*} value
 * @return {string}
 */
function toMoney(value) {
  return Number((Number(value) * 100).toFixed(0));
}

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
  flightService,
}) => {
  router.post('/api/policies', async (ctx) => {
    const { body } = ctx.request;
    const validate = ajv.compile(applyPolicySchema);

    log.info(body);

    if (!validate(body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    const enoughEth = await gif.checkBalance();

    if (!enoughEth) {
      ctx.badRequest({ error: 'Seems like there is not enough ether on the contracts.' });
      return;
    }

    const testMode = Boolean(ctx.query.mode);

    try {
      const customer = {
        firstname: body.firstName,
        lastname: body.lastName,
        email: body.email,
      };

      const payment = {
        kind: 'fiat',
        premium: toMoney(body.amount / 100),
        currency: body.currency,
        provider: 'stripe',
        sourceId: body.stripeSourceId,
      };

      const { payouts } = body;

      const policyStartDate = `${moment(Date.now()).utc().format('MMMM DD, YYYY HH:mm')} GMT (Greenwich Mean Time)`;
      const policyExpireDate = `${moment(body.arrivesAt).utcOffset(moment.parseZone(body.arrivesAt).utcOffset()).add(24, 'hours').format('MMMM DD, YYYY HH:mm')} (local time at destination)`;

      const policy = {
        distributorId: '11111111-1111-1111-1111-111111111111',
        carrier: body.carrier,
        departsAt: body.departsAt,
        arrivesAt: body.arrivesAt,
        origin: body.origin,
        destination: body.destination,
        flightNumber: body.flightNumber,
        premium: payment.premium,
        currency: payment.currency,
        payout3: toMoney(payouts.p3),
        payout4: toMoney(payouts.p4),
        payout5: toMoney(payouts.p5),
        policyStartDate,
        policyExpireDate,
      };

      const { policyId, customerId } = await gif.policyCreationRequest({
        creationId: uuid(),
        customer,
        policy,
        payment,
      });

      const { Policy, Customer, PolicyExtra } = db;

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
        carrierFlightNumber: utils.asciiToHex(`${policy.carrier}/${policy.flightNumber}`),
        yearMonthDay: utils.asciiToHex(moment(policy.departsAt).format('YYYY/MM/DD')),
        departureTime: moment(policy.departsAt).unix(),
        arrivalTime: moment(policy.arrivesAt).unix(),
        premium: payment.premium,
        currency: utils.asciiToHex('EUR'), // payment.currency,
        payoutOptions: [0, 0, toMoney(payouts.p3), toMoney(payouts.p4), toMoney(payouts.p5)],
        customerExternalId: utils.padRight(utils.utf8ToHex(customerId), 34).substr(0, 34),
      };

      try {
        const flightRatingsMode = await gif.checkFlightRatingsMode();
        const flightStatusesMode = await gif.checkFlightStatusesMode();

        if (flightRatingsMode !== flightStatusesMode || flightRatingsMode !== testMode) {
          throw new Error('Oracle contracts and UI are in different modes');
        }

        const flightRating = await flightService.getFlightRating(policy.carrier, policy.flightNumber, testMode);
        const statistics = [
          flightRating.observations,
          flightRating.late15,
          flightRating.late30,
          flightRating.late45,
          flightRating.cancelled,
          flightRating.diverted,
        ];

        const payoutOptions = await gif.calculatePayouts(payment.premium, statistics);

        payoutOptions._payoutOptions.forEach((option, i) => {
          if (String(option) !== String(application.payoutOptions[i])) {
            throw new Error(`Invalid payout option: ${option} but ${application.payoutOptions[i]} received`);
          }
        });

        const transactionResult = await gif.applyForPolicy(application);
        const { transactionHash, events } = transactionResult;

        if (events.LogError) {
          const { error: message } = events.LogError.returnValues;
          switch (message) {
            case 'ERROR::CLUSTER_RISK':
              throw new Error('cluster_risk');
            case 'ERROR::INVALID_PAYOUT_OPTION':
              throw new Error('invalid_payout_option');
            default:
              throw new Error('');
          }
        }

        const { applicationId: contractApplicationId } = events.LogNewApplication.returnValues;

        await gif.applyForPolicySuccess({ policyId, contractApplicationId });

        await Policy.query()
          .update({ contractApplicationId })
          .where('id', policyId);

        ctx.ok({ customerId, policyToken: policyId, txHash: transactionHash });
      } catch (error) {
        await PolicyExtra.query().delete().where('policyId', policyId);
        await Policy.query().delete().where('id', policyId);
        await gif.applyForPolicyError({ policyId });
        log.error(error);
        ctx.badRequest({ error: error.message });
      }
    } catch (error) {
      log.error(error);
      ctx.badRequest({ error: error.error ? error.error : error.message });
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
    const { id } = ctx.params;

    const [policy, extra] = await Promise.all([
      db.Policy.query().where('id', id).first(),
      db.PolicyExtra.query().where('policyId', id).then(rows => _.fromPairs(_.map(rows, r => [r.field, r.value]))),
    ]);

    if (!policy) {
      ctx.status = 404;
      return;
    }

    const customer = await db.Customer.query().where('id', policy.customerId).first();

    ctx.body = {
      policyHolder:
      {
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
      },
      number: policy.id,
      flight: {
        carrier: extra.carrier,
        flightNumber: extra.flightNumber,
        origin: extra.origin,
        destination: extra.destination,
        departsAt: `${moment(extra.departsAt).utcOffset(moment.parseZone(extra.departsAt).utcOffset()).format('MMMM DD, YYYY HH:mm')} (local time)`,
        arrivesAt: `${moment(extra.arrivesAt).utcOffset(moment.parseZone(extra.arrivesAt).utcOffset()).format('MMMM DD, YYYY HH:mm')} (local time)`,
      },
      policyStartDate: extra.policyStartDate,
      policyExpireDate: extra.policyExpireDate,
      premium: {
        amount: extra.premium / 100,
        currency: extra.currency,
      },
      compensation: {
        d45: extra.payout3 / 100,
        can: extra.payout4 / 100,
        div: extra.payout5 / 100,
      },
    };
    ctx.ok();
  });

  router.get('/api/customers/:id/policies', async (ctx) => {
    const customerId = ctx.params.id;

    const policies = await db.Policy.query()
      .where({ customerId });

    let extra = await db.PolicyExtra.query()
      .where('policyId', 'in', _.map(policies, p => p.id));

    extra = _.groupBy(extra, 'policyId');

    for (let i = 0, l = policies.length; i < l; i += 1) {
      policies[i].extra = _.fromPairs(_.map(extra[policies[i].id], e => [e.field, e.value]));
    }

    ctx.ok(_.map(policies, p => ({
      id: p.id,
      carrier: p.extra.carrier,
      flightNumber: p.extra.flightNumber,
      origin: p.extra.origin,
      destination: p.extra.destination,
      departsAt: p.extra.departsAt,
      arrivesAt: p.extra.arrivesAt,
      amount: p.extra.premium / 100,
      currency: p.extra.currency,
      status: '1',
    })));
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
