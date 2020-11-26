require('dotenv').config({ path: '../.env' });
const { bootstrap } = require('@etherisc/microservice');
const EventLogging = require('./EventLogging');


bootstrap(EventLogging, {
  amqp: true,
  db: true,
});
