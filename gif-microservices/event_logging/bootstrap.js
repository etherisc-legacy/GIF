require('dotenv').config();
const { bootstrap } = require('@etherisc/microservice');
const EventLogging = require('./EventLogging');


const requiredEnv = [];

bootstrap(EventLogging, {
  amqp: true,
  db: true,
  appName: process.env.APP_NAME,
  appVersion: process.env.APP_VERSION,
  requiredEnv,
});
