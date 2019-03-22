const { UniqueViolationError } = require('objection-db-errors');


const createProductSchema = {
  properties: {
    name: {
      type: 'string',
      pattern: '^[^\\W_]+$', // Any string of alphanumeric characters without underscores
      minLength: 3,
      maxLength: 20,
      not: { enum: ['admin', 'platform'] },
    },
  },
  required: ['name'],
  additionalProperties: false,
};

module.exports = ({
  ajv,
  router,
  models,
  log,
  rabbitAPIService,
}) => {
  const { Product } = models;

  // Products index
  router.get('/api/products', async (ctx) => {
    const { id: userId } = ctx.state.user.data;
    const products = await Product.query().where({ userId });
    ctx.ok({ userId, products });
  });


  // Create product
  router.post('/api/products', async (ctx) => {
    const { id: userId } = ctx.state.user.data;
    const { body } = ctx.request;

    const validate = ajv.compile(createProductSchema);
    if (!validate(body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    try {
      const productData = {
        userId,
        name: body.name,
      };

      const product = await Product.query().insertGraph(productData);

      const { password, registrationError } = await rabbitAPIService.register(product.name);

      if (registrationError) {
        await Product.query().deleteById(product.id);
        ctx.badRequest({ error: registrationError });
        return;
      }

      log.info(`New product created: ${product.name}`);

      ctx.ok({
        id: product.id,
        password,
      });
    } catch (error) {
      log.error(error);
      let errorMessage = 'Unknown server error encountered';
      if (error instanceof UniqueViolationError) {
        errorMessage = error.nativeError.detail;
      }
      ctx.badRequest({ error: errorMessage });
    }
  });
};
