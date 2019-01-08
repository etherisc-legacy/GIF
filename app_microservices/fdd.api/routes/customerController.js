// const createCustomerSchema = {
//   properties: {
//     firstName: { type: 'string' },
//     lastName: { type: 'string' },
//     email: { type: 'string', format: 'email' },
//     ethereumAccount: { type: 'string' },
//   },
//   required: ['firstName', 'lastName', 'email'],
//   additionalProperties: false,
// };


module.exports = ({ router, amqp }) => {
  router.post('/api/customers', async (ctx) => {
    // const validate = ajv.compile(createCustomerSchema);

    // if (!validate(ctx.request.body)) {
    //   ctx.badRequest({ error: validate.errors });
    //   return;
    // }

    // ctx.body = await customerService.create(ctx.request.body);
    ctx.ok();
  });
};
