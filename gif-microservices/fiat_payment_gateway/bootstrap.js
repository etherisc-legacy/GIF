require('dotenv').config();
const { bootstrap } = require('@etherisc/microservice');
const FiatPaymentGateway = require('./FiatPaymentGateway');


const requiredEnv = ['STRIPE_SECRET_KEY'];

bootstrap(FiatPaymentGateway, {
  db: true,
  amqp: true,
  appName: process.env.APP_NAME,
  appVersion: process.env.APP_VERSION,
  requiredEnv,
});
