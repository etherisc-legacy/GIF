require('dotenv').config();
const { bootstrap } = require('@etherisc/microservice');
const EventListener = require('./EventListener');


const requiredEnv = ['NETWORK_NAME', 'HTTP_PROVIDER'];

bootstrap(EventListener, {
  amqp: true,
  db: true,
  s3: true,
  appName: process.env.APP_NAME,
  appVersion: process.env.APP_VERSION,
  requiredEnv,
});
