require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });
const { knexfile } = require('@etherisc/microservice');


const appName = process.env.APP_NAME;


module.exports = {
  ...knexfile(appName),
  schema: appName,
  constants: {
    PAYOUT_TABLE: 'payout',
  },
};
