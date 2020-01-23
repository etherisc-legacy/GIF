const { bootstrap } = require('@etherisc/microservice');
const AmqpLogger = require('./amqplogger');


bootstrap(AmqpLogger, {
  amqp: true,
});
