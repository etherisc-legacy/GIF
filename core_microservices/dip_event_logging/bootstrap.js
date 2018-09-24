const DipEventLogging = require('./DipEventLogging');

const dipEventLogging = new DipEventLogging({
  amqpBroker: process.env.MESSAGE_BROKER || 'amqp://localhost:5672',
  pgConnectionString: process.env.DATABASE_URL || 'postgresql://postgresql:postgresql@localhost:5433/postgresql',
});

dipEventLogging.listen();
