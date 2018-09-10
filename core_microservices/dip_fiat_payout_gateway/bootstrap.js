const DipFiatPayoutGateway = require('./DipFiatPayoutGateway');

const dipFiatPayoutGateway = new DipFiatPayoutGateway({ amqpBroker: 'amqp://localhost:5672' });

dipFiatPayoutGateway.listen();
