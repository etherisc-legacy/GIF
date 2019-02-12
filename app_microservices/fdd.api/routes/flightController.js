const searchFlightsSchema = {
  properties: {
    origin: { type: 'string' },
    destination: { type: 'string' },
    date: { type: 'string', format: 'date' },
  },
  required: ['origin', 'destination', 'date'],
  additionalProperties: false,
};

const getFlightRatingSchema = {
  properties: {
    carrier: { type: 'string' },
    flightNumber: { type: 'string' },
  },
  required: ['carrier', 'flightNumber'],
  additionalProperties: false,
};

module.exports = ({
  router,
  ajv,
  flightService,
}) => {
  router.post('/api/flights/search', async (ctx) => {
    const validate = ajv.compile(searchFlightsSchema);
    const payload = ctx.request.body;

    if (validate(payload)) {
      const { origin, destination, date } = payload;

      ctx.body = await flightService.searchFlights(origin, destination, date);
    } else {
      ctx.badRequest({ error: validate.errors });
    }
  });

  router.get('/api/flights/rating/:carrier/:flightNumber', async (ctx) => {
    const validate = ajv.compile(getFlightRatingSchema);

    if (!validate(ctx.params)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    const testMode = Boolean(ctx.query.mode);

    const { carrier, flightNumber } = ctx.params;
    const rating = await flightService.getFlightRating(carrier, flightNumber, testMode);

    if (rating) {
      ctx.ok(rating);
    } else {
      ctx.ok({ error: '404', type: 'RatingsNotFound' });
    }
  });
};
