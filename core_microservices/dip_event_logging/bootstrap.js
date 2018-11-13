const { bootstrap } = require('@etherisc/microservice');
const DipEventLogging = require('./DipEventLogging');


bootstrap(DipEventLogging, {
  amqp: true,
  db: true,
});
