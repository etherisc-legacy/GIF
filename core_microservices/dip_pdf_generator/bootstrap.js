const DipPdfGenerator = require('./DipPdfGenerator');

const dipPdfGenerator = new DipPdfGenerator({ amqpBroker: 'amqp://localhost:5672' });

dipPdfGenerator.listen();
