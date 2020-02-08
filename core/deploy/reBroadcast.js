// eslint-disable-next-line import/no-extraneous-dependencies
const { bootstrap } = require('@etherisc/microservice');
const RePublishContracts = require('./RePublishContracts');


bootstrap(RePublishContracts, {
  amqp: true,
});
