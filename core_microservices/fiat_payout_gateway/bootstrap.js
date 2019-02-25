require('dotenv').config();
const { bootstrap } = require('@etherisc/microservice');
const FiatPayoutGateway = require('./FiatPayoutGateway');


bootstrap(FiatPayoutGateway, {
  amqp: true,
  db: true,
});
