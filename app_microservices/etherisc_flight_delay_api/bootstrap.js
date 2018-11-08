const { bootstrap, isDockerHost } = require('@etherisc/microservice');
const FlightDelayInsurance = require('./FlightDelayInsurance');
const GenericInsurance = require('./GenericInsurance');


bootstrap(GenericInsurance, {
  httpPort: isDockerHost() && !process.env.CI ? 3000 : 3017,
  wsPort: 4000,
  app: new FlightDelayInsurance(),
});
