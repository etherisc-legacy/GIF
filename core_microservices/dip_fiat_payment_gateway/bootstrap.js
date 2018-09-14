const DipFiatPaymentGateway = require('./DipFiatPaymentGateway');

const dipFiatPaymentGateway = new DipFiatPaymentGateway({ amqpBroker: process.env.MESSAGE_BROKER || 'amqp://localhost:5672' });

dipFiatPaymentGateway.listen()
