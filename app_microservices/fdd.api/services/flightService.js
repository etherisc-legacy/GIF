const Flight = require('./../model/flight/flight');

/**
 * Flight service
 */
class FlightService {
  /**
   * constructor
   * @param {*} param0
   */
  constructor({ flightStatsClient, log }) {
    this.flightStatsClient = flightStatsClient;
    this.log = log;
  }

  /**
   * Search flights
   * @param {*} origin
   * @param {*} destination
   * @param {*} date
   * @return {[]}
   */
  async searchFlights(origin, destination, date) {
    const { flightStatsClient } = this;

    const flightResponse = await flightStatsClient.findAvailableFlights(origin, destination, date);
    const { airports } = flightResponse.appendix;

    const flights = flightResponse
      .scheduledFlights
      .filter(Flight.isApplicable)
      .map((flight, i) => Flight.create(i, flight, airports))
      .sort((first, second) => first.compareTo(second));

    this.log.info(`Search flights ${origin} to ${destination} on ${date}. Found ${flights.length} items`);

    return flights;
  }

  /**
   * Get flight rating
   * @param {*} carrier
   * @param {*} flightNumber
   * @return {{}}
   */
  async getFlightRating(carrier, flightNumber) {
    const { flightStatsClient } = this;

    const ratings = await flightStatsClient.getFlightRating(carrier, flightNumber);

    return (ratings && ratings[0]) ? ratings[0] : null;
  }
}

module.exports = FlightService;
