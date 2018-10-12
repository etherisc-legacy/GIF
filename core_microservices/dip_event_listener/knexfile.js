const { knexfile } = require('@etherisc/microservice');


const { prefix } = knexfile;

module.exports = {
  ...knexfile,
  constants: {
    CONTRACTS_TABLE: `${prefix}_contracts`,
    EVENTS_TABLE: `${prefix}_events`,
  },
};
