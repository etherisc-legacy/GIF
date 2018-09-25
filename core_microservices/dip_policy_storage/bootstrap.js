const DipPolicyStorage = require('./DipPolicyStorage');


const dipPolicyStorage = new DipPolicyStorage({ amqpBroker: process.env.MESSAGE_BROKER || 'amqp://localhost:5672' });

dipPolicyStorage.listen();
