require('dotenv').config({ path: `./env.${process.env.NODE_ENV}` });
const { bootstrap } = require('@etherisc/microservice');
const EventListener = require('./EventListener');


const requiredEnv = ['NETWORK_NAME', 'HTTP_PROVIDER'];

bootstrap(EventListener, {
  amqp: true,
  db: true,
  s3: true,
  requiredEnv,
});
