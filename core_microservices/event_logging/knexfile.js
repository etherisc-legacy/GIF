require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });
const { knexfile } = require('@etherisc/microservice');


const appName = process.env.APP_NAME;
console.log(appName);


module.exports = {
  ...knexfile(appName),
  schema: appName,
  constants: {
    EVENT_TABLE: `${appName}.events`,
  },
};
