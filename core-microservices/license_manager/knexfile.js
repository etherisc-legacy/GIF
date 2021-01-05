require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });
const { knexfile } = require('@etherisc/microservice');


const appName = process.env.APP_NAME;


module.exports = {
  ...knexfile(appName),
  schema: appName,
  constants: {
    USERS_TABLE: 'users',
    PRODUCTS_TABLE: 'products',
  },
  seeds: {
    directory: `${__dirname}/seeds`,
  },
};
