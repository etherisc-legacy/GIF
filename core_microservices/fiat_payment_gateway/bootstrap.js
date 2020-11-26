require('dotenv').config({ path: '../.env' });
const { bootstrap } = require('@etherisc/microservice');
const FiatPaymentGateway = require('./FiatPaymentGateway');


bootstrap(FiatPaymentGateway, {
  db: true,
  amqp: true,
});
