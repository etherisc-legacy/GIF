const { knexfile } = require('@etherisc/microservice');


module.exports = {
  ...knexfile,
  schema: knexfile.prefix,
  constants: {
    CONTRACTS_TABLE: 'contracts',
    EVENTS_TABLE: 'events',
  },
};
