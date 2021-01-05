const { UniqueViolationError } = require('objection-db-errors');


const createUserSchema = {
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: ['firstname', 'lastname', 'email', 'password'],
  additionalProperties: false,
};

const authenticateUserSchema = {
  properties: {
    id: { type: 'integer', minimum: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: ['password'],
  oneOf: [
    { required: ['id'] },
    { required: ['email'] },
  ],
  additionalProperties: false,
};

module.exports = ({
  ajv,
  router,
  models,
  log,
  tokenGenerationService,
  rabbitAPIService,
}) => {
  const { User, Product } = models;

  // Users index
  router.get('/api/users', async (ctx) => {
    const users = await User.query().select('id');
    ctx.ok(users);
  });

  // Create user
  router.post('/api/users', async (ctx) => {
    const { body } = ctx.request;

    const validate = ajv.compile(createUserSchema);
    if (!validate(body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    try {
      const userData = {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        password: body.password,
      };

      const user = await User.query().insertGraph(userData);

      log.info(`New user created: ${body.email}, id ${user.id}`);

      ctx.ok({
        token: tokenGenerationService.generateToken(user),
        id: user.id,
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

  // Authorize user
  router.post('/api/users/login', async (ctx) => {
    const { body } = ctx.request;

    const validate = ajv.compile(authenticateUserSchema);
    if (!validate(body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    try {
      const { password, ...userLookup } = body;

      const user = await User.query().first().where(userLookup);
      if (!user) {
        ctx.badRequest({ error: `No user found with ${JSON.stringify(userLookup)}` });
        return;
      }

      const passwordValid = await user.verifyPassword(password);
      if (!passwordValid) {
        ctx.badRequest({ error: 'Wrong password' });
        return;
      }

      const products = await Product.query().where({ userId: user.id });
      const amqpLogins = {};

      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        const response = await rabbitAPIService.register(product.name);
        if (response.updateError) {
          ctx.badRequest({ error: response.updateError });
          return;
        }
        amqpLogins[product.name] = {
          id: product.id,
          amqpLogin: product.name,
          amqpPassword: response.password,
        };
      }

      ctx.ok({
        id: user.id,
        token: tokenGenerationService.generateToken(user),
        products: amqpLogins,
      });
    } catch (error) {
      log.error(error);
      const errorMessage = 'Unknown server error encountered';
      ctx.badRequest({ error: errorMessage });
    }
  });
};
