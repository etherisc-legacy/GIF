require('dotenv').config({ path: '../.env' });
const { bootstrap } = require('@etherisc/microservice');
const EthereumClient = require('./EthereumClient');


bootstrap(EthereumClient, {
  amqp: true,
  db: true,
});
