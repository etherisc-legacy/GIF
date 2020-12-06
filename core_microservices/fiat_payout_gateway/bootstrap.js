require('dotenv').config({ path: '../.env' });
const { bootstrap } = require('@etherisc/microservice');
const FiatPayoutGateway = require('./FiatPayoutGateway');


const requiredEnv = ['TRANSFERWISE_SRC_CURRENCY', 'TRANSFERWISE_PROFILE_ID', 'TRANSFERWISE_API_URL',
  'TRANSFERWISE_API_TOKEN', 'TRANSFERWISE_LOGIN', 'TRANSFERWISE_PASSWORD'];

bootstrap(FiatPayoutGateway, {
  amqp: true,
  db: true,
  requiredEnv,
});
