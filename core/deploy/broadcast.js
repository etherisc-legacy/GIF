const { bootstrap } = require('@etherisc/microservice');
const PublishContracts = require('./PublishContracts');


bootstrap(PublishContracts, {
  amqp: true,
});
