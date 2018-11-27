const { bootstrap } = require('@etherisc/microservice');
const GifFiatPaymentGateway = require('./DipFiatPaymentGateway');


bootstrap(GifFiatPaymentGateway, {
  db: true,
  amqp: true,
});
