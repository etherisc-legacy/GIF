const DipEventLogging = require('./DipEventLogging');


const dipEventLogging = new DipEventLogging({
  amqpBroker: process.env.MESSAGE_BROKER || 'amqp://localhost:5672',
  pgConnectionString: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@postgres:5432/${process.env.POSTGRES_DB}` || 'postgresql://postgresql:postgresql@localhost:5432/postgresql',
});

(async () => {
  try {
    await dipEventLogging.listen();
  } catch (e) {
    console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    process.exit(1);
  }
})();
