require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });
const { bootstrap } = require('@etherisc/microservice');
const PolicyStorage = require('./PolicyStorage');


const requiredEnv = ['HTTP_PROVIDER', 'SALT', 'NETWORK_NAME',
  'POSTGRES_SERVICE_HOST', 'POSTGRES_SERVICE_PORT', 'POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD'];

bootstrap(PolicyStorage, {
  db: true,
  amqp: true,
  appName: process.env.APP_NAME,
  appVersion: process.env.APP_VERSION,
  requiredEnv,
});
