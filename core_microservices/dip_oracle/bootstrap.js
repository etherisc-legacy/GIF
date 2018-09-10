const DipOracle = require('./DipOracle');

const dipOracle = new DipEthereumClient({ amqpBroker: 'amqp://localhost:5672' });

dipEthereumClient.listen();
