const FlightService = require('./flightService');
const GifService = require('./gifService');


module.exports = (deps) => {
  const flightService = new FlightService({ ...deps });
  const gifService = new GifService({ ...deps });

  return {
    gif: gifService,
    flightService,
  };
};
