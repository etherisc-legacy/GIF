const { knexfile } = require('@etherisc/microservice');


module.exports = {
  ...knexfile,
  schema: knexfile.prefix,
  constants: {
    PRODUCTS_TABLE: 'products',
  },
  seeds: {
    directory: `${__dirname}/seeds`,
  },
};
