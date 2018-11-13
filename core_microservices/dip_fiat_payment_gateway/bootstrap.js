const { bootstrap } = require('@etherisc/microservice');
const DipFiatPaymentGateway = require('./DipFiatPaymentGateway');


bootstrap(DipFiatPaymentGateway, {
  amqp: true,
});
