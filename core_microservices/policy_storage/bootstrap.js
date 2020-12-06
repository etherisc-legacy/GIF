require('dotenv').config({ path: '../.env' });
const { bootstrap } = require('@etherisc/microservice');
const PolicyStorage = require('./PolicyStorage');


const requiredEnv = ['HTTP_PROVIDER', 'SALT', 'NETWORK_NAME'];

bootstrap(PolicyStorage, {
  db: true,
  amqp: true,
  requiredEnv,
});
