const { knexfile } = require('@etherisc/microservice');


module.exports = {
  ...knexfile,
  schema: knexfile.prefix,
  constants: {
    POLICY_TABLE: 'policy',
    POLICY_EXTRA_TABLE: 'policy_extra',
    CUSTOMER_TABLE: 'customer',
    CUSTOMER_EXTRA_TABLE: 'customer_extra',
    DISTRIBUTOR_TABLE: 'distributor',
  },
};
