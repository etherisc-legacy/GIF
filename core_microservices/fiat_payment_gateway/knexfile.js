const { knexfile } = require('@etherisc/microservice');


module.exports = {
  ...knexfile,
  schema: knexfile.prefix,
  constants: {
    PAYMENTS_TABLE: 'payments',
    PAYMENTS_DATA_TABLE: 'payments_data',
  },
};
