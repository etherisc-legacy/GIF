require('dotenv').config({ path: `./env.${process.env.NODE_ENV}` });
const { bootstrap } = require('@etherisc/microservice');
const EthereumClient = require('./EthereumClient');


const requiredEnv = ['MNEMONIC', 'WS_PROVIDER', 'HTTP_PROVIDER', 'NETWORK_NAME', 'ACCOUNT'];

bootstrap(EthereumClient, {
  amqp: true,
  db: true,
  requiredEnv,
});
