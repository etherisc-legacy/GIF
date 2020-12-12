require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });
const { knexfile } = require('@etherisc/microservice');


const appName = process.env.APP_NAME;


module.exports = {
  ...knexfile(appName),
  schema: appName,
  constants: {
    CONTRACTS_TABLE: 'contracts',
    EVENTS_TABLE: 'events',
  },
};
