require('dotenv').config();
const { knexfile } = require('@etherisc/microservice');


const appName = process.env.APP_NAME;


module.exports = {
  ...knexfile(appName),
  schema: appName,
  constants: {
    PAYMENTS_TABLE: 'payments',
    PAYMENTS_DATA_TABLE: 'payments_data',
  },
};
