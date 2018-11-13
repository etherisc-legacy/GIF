const { bootstrap } = require('@etherisc/microservice');
const FlightDelayInsurance = require('./FlightDelayInsurance');
const GenericInsurance = require('./GenericInsurance');


bootstrap(GenericInsurance, {
  httpDevPort: 3017,
  wsPort: 4000,
  app: new FlightDelayInsurance(),
  amqp: true,
});
