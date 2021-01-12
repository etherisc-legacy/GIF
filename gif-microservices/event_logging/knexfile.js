require('dotenv').config();
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
