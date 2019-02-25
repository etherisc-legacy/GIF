const { knexfile } = require('@etherisc/microservice');


module.exports = {
  ...knexfile,
  schema: knexfile.prefix,
  constants: {
    PAYOUT_TABLE: 'payout',
  },
};
