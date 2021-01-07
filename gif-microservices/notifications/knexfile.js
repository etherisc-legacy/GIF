require('dotenv').config();
const { knexfile } = require('@etherisc/microservice');


const appName = process.env.APP_NAME;


module.exports = {
  ...knexfile(appName),
  schema: appName,
  constants: {
    PRODUCT_SETTINGS_TABLE: 'product_settings',
  },
};
