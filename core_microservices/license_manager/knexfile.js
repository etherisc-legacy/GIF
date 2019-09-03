const { knexfile } = require('@etherisc/microservice');


module.exports = {
  ...knexfile,
  schema: knexfile.prefix,
  constants: {
    USERS_TABLE: 'users',
    PRODUCTS_TABLE: 'products',
  },
  seeds: {
    directory: `${__dirname}/seeds`,
  },
};
