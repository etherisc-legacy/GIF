const FlightDelayInsurance = require('./FlightDelayInsurance');
const GenericInsurance = require('./GenericInsurance');


const flightDelayInsurance = new FlightDelayInsurance();
const genericInsurance = new GenericInsurance(flightDelayInsurance);

genericInsurance.listen({
  amqpBroker: 'amqp://localhost:5672',
  wsPort: 3000,
});
