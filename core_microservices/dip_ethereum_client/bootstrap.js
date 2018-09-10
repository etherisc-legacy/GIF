const DipEthereumClient = require('./DipEtheremClient');

const dipEthereumClient = new DipEthereumClient({ amqpBroker: 'amqp://localhost:5672' });

dipEthereumClient.listen();
