require('dotenv').config();
const { knexfile } = require('@etherisc/microservice');


const appName = process.env.APP_NAME;

module.exports = {
  ...knexfile(appName),
  schema: appName,
  constants: {
    DISTRIBUTOR_TABLE: 'distributor',
    POLICY_TABLE: 'policy',
    POLICY_EXTRA_TABLE: 'policy_extra',

    CUSTOMER_TABLE: 'customer',
    CUSTOMER_EXTRA_TABLE: 'customer_extra',
    METADATA_TABLE: 'metadata',
    METADATA_EXTRA_TABLE: 'metadata_extra',
    APPLICATIONS_TABLE: 'applications',
    APPLICATIONS_EXTRA_TABLE: 'applications_extra',
    POLICIES_TABLE: 'policies',
    POLICIES_EXTRA_TABLE: 'policies_extra',
    CLAIMS_TABLE: 'claim',
    CLAIMS_EXTRA_TABLE: 'claims_extra',
    PAYOUTS_TABLE: 'payouts',
    PAYOUTS_EXTRA_TABLE: 'payouts_extra',
    CONTRACTS_TABLE: 'contracts',
    CHANGES_TABLE: 'changes',
    PRODUCTS_TABLE: 'products',
  },
};
