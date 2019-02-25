const knexfile = require('@etherisc/microservice/knexfile');


module.exports = {
  ...knexfile,
  schema: knexfile.prefix,
  constants: {
    EVENT_TABLE: `${knexfile.prefix}.events`,
  },
};
