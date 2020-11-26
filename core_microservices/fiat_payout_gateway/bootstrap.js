require('dotenv').config({ path: '../.env' });
const { bootstrap } = require('@etherisc/microservice');
const FiatPayoutGateway = require('./FiatPayoutGateway');

/**
 * Switch off payout gateway unless explicitly enabled
 */
if (!process.env.FIAT_PAYOUT_GATEWAY) process.exit(0);

bootstrap(FiatPayoutGateway, {
  amqp: true,
  db: true,
});
