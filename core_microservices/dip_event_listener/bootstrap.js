const DipEventListener = require('./DipEventListener');


const dipEventListener = new DipEventListener({
  amqpBroker: process.env.MESSAGE_BROKER || 'amqp://localhost:5672',
  pgConnectionString: process.env.POSTGRES_USER ? `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@postgres:5432/${process.env.POSTGRES_DB}` : 'postgresql://postgresql:postgresql@localhost:5432/postgresql',
  rpcNode: process.env.RPC_NODE || 'ws://localhost:8545',
  networkName: process.env.NETWORK_NAME || 'development',
});

(async () => {
  try {
    await dipEventListener.listen();
  } catch (e) {
    console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    process.exit(1);
  }
})();
