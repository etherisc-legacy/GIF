const { knexfile } = require('@etherisc/microservice');


const { prefix } = knexfile;

module.exports = {
  ...knexfile,
  constants: {
    POLICY_TABLE: `${prefix}_policy`,
    POLICY_EXTRA_TABLE: `${prefix}_policy_extra`,
    CUSTOMER_TABLE: `${prefix}_customer`,
    CUSTOMER_EXTRA_TABLE: `${prefix}_customer_extra`,
    DISTRIBUTOR_TABLE: `${prefix}_distributor`,
  },
};
