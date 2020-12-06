require('dotenv').config({ path: '../.env' });
const { bootstrap } = require('@etherisc/microservice');
const EventLogging = require('./EventLogging');


const requiredEnv = [];

bootstrap(EventLogging, {
  amqp: true,
  db: true,
  requiredEnv,
});
