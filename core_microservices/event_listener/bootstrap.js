require('dotenv').config();
const { bootstrap } = require('@etherisc/microservice');
const EventListener = require('./EventListener');


bootstrap(EventListener, {
  amqp: true,
  db: true,
  s3: true,
  rpcNode: process.env.WS_PROVIDER || 'ws://localhost:8545',
  networkName: process.env.NETWORK_NAME || 'development',
});
