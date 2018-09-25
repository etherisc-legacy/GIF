const DipEthereumClient = require('./DipEtheremClient');


const dipEthereumClient = new DipEthereumClient({ amqpBroker: process.env.MESSAGE_BROKER || 'amqp://localhost:5672' });

dipEthereumClient.listen();
