const DipFiatPayoutGateway = require('./DipFiatPayoutGateway');

const dipFiatPayoutGateway = new DipFiatPayoutGateway({ amqpBroker: process.env.MESSAGE_BROKER || 'amqp://localhost:5672' });

dipFiatPayoutGateway.listen();
