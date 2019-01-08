const moment = require('moment');
const fetch = require('node-fetch');


const BASE_URL = 'https://api.flightstats.com/flex';
const FLIGHT_SCHEDULES_URL = `${BASE_URL}/schedules/rest/v1/json`;

/**
 * FlightStats client
 */
class FlightStatsClient {
  /**
   * constructor
   * @param {*} param0
   */
  constructor({ FLIGHT_STATS_ID, FLIGHT_STATS_KEY }) {
    this.FLIGHT_STATS_ID = FLIGHT_STATS_ID;
    this.FLIGHT_STATS_KEY = FLIGHT_STATS_KEY;
  }

  /**
   * Find available flights
   * @param {*} origin
   * @param {*} destination
   * @param {*} date
   */
  async findAvailableFlights(origin, destination, date) {
    const { FLIGHT_STATS_ID, FLIGHT_STATS_KEY } = this;

    const [year, month, day] = moment(date).format('YYYY-MM-DD').split('-');

    const url = `${FLIGHT_SCHEDULES_URL}/from/${origin}/to/${destination}/departing/${year}/${month}/${day}?`;
    const query = `appId=${FLIGHT_STATS_ID}&appKey=${FLIGHT_STATS_KEY}&extendedOptions=includeDirects`;

    const response = await fetch(url + query);

    return response.json();
  }

  /**
   * Get flight rating
   * @param {*} carrier
   * @param {*} flightNumber
   */
  async getFlightRating(carrier, flightNumber) {
    const { FLIGHT_STATS_ID, FLIGHT_STATS_KEY } = this;

    const url = `${BASE_URL}/ratings/rest/v1/json/flight/${carrier}/${flightNumber}?`;
    const query = `appId=${FLIGHT_STATS_ID}&appKey=${FLIGHT_STATS_KEY}`;

    const response = await fetch(url + query);
    const data = await response.json();

    return data.ratings;
  }
}

module.exports = FlightStatsClient;
