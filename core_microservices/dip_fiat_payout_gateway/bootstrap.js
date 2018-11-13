const { bootstrap } = require('@etherisc/microservice');
const DipFiatPayoutGateway = require('./DipFiatPayoutGateway');


bootstrap(DipFiatPayoutGateway, {
  amqp: true,
});
