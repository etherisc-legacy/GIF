require('dotenv').config({ path: '../.env' });
const { bootstrap } = require('@etherisc/microservice');
const PolicyStorage = require('./PolicyStorage');


bootstrap(PolicyStorage, {
  db: true,
  amqp: true,
});
