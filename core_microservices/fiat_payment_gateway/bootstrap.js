require('dotenv').config({ path: '../.env' });
const { bootstrap } = require('@etherisc/microservice');
const FiatPaymentGateway = require('./FiatPaymentGateway');

/**
 * Switch off payout gateway unless explicitly enabled
 */
if (!process.env.FIAT_PAYMENT_GATEWAY) process.exit(0);

bootstrap(FiatPaymentGateway, {
  db: true,
  amqp: true,
});
