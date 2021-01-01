require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });
const { knexfile } = require('@etherisc/microservice');


const appName = process.env.APP_NAME;


module.exports = {
  ...knexfile(appName),
  schema: appName,
  constants: {
    POLICY_TABLE: 'policy',
    POLICY_EXTRA_TABLE: 'policy_extra',
    CUSTOMER_TABLE: 'customer',
    CUSTOMER_EXTRA_TABLE: 'customer_extra',
  },
};
