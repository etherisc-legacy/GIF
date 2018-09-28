const DipEventLogging = require('./DipEventLogging');


const dipEventLogging = new DipEventLogging({
  amqpBroker: process.env.MESSAGE_BROKER || 'amqp://localhost:5672',
  pgConnectionString: process.env.DATABASE_URL || 'postgresql://postgresql:postgresql@localhost:5432/postgresql',
});

(async () => {
  try {
    await dipEventLogging.listen();
  } catch (e) {
    console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    process.exit(1);
  }
})();
