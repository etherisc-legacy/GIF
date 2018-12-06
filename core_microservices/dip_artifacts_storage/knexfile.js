const { knexfile } = require('@etherisc/microservice');


module.exports = {
  ...knexfile,
  schema: knexfile.prefix,
  constants: {
    ARTIFACTS_TABLE: 'artifacts',
  },
};
