const DipPdfGenerator = require('./DipPdfGenerator');


const dipPdfGenerator = new DipPdfGenerator({ amqpBroker: process.env.MESSAGE_BROKER || 'amqp://localhost:5672' });

dipPdfGenerator.listen();
