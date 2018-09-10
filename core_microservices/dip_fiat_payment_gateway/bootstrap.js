const DipFiatPaymentGateway = require('./DipFiatPaymentGateway');

const dipFiatPaymentGateway = new DipFiatPaymentGateway({ amqpBroker: 'amqp://localhost:5672' });

dipFiatPaymentGateway.listen()
