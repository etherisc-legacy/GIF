const { bootstrap } = require('@etherisc/microservice');
const DipEthereumClient = require('./DipEtheremClient');


bootstrap(DipEthereumClient, {
  amqp: true,
});
