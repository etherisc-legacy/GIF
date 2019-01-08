const moment = require('moment');
const _ = require('lodash');

/**
 * Flight model
 */
class Flight {
  /**
   * Airport time
   * @param {*} time
   * @param {*} airport
   * @return {string}
   */
  static airportTime(time, airport) {
    return moment(time)
      .utcOffset(airport.utcOffsetHours, true)
      .format();
  }

  /**
   * Get codeshares
   * @param {*} codeshares
   * @return {string}
   */
  static getCodeshares(codeshares) {
    if (codeshares.length > 0) {
      return codeshares
        .map(codeshare => `${codeshare.carrierFsCode}/${codeshare.flightNumber}`)
        .join(', ');
    }
    return '';
  }

  /**
   * isApplicable
   * @param {*} flight
   * @return {boolean}
   */
  static isApplicable(flight) {
    const isDirectFlight = flight.stops === 0;
    const isNotCodeshare = flight.isCodeshare === false;

    return isDirectFlight && isNotCodeshare;
  }

  /**
   * Create a new flight
   * @param {*} id
   * @param {*} flight
   * @param {*} airports
   * @return {Flight}
   */
  static create(id, flight, airports) {
    const departureAirport = _.find(airports, { fs: flight.departureAirportFsCode });
    const arrivalAirport = _.find(airports, { fs: flight.arrivalAirportFsCode });

    return new Flight(id, flight, arrivalAirport, departureAirport);
  }

  /**
   * constructor
   * @param {*} id
   * @param {*} flightData
   * @param {*} arrivalAirport
   * @param {*} departureAirport
   */
  constructor(id, flightData, arrivalAirport, departureAirport) {
    const {
      carrierFsCode,
      flightNumber,
      departureAirportFsCode,
      arrivalAirportFsCode,
    } = flightData;
    const { arrivalTime, departureTime, codeshares } = flightData;
    const { airportTime, getCodeshares } = Flight;

    Object.assign(this, {
      id: `f${id}`,
      carrier: carrierFsCode,
      flightNumber,
      origin: departureAirportFsCode,
      destination: arrivalAirportFsCode,
      arrivalTime: airportTime(arrivalTime, arrivalAirport),
      departureTime: airportTime(departureTime, departureAirport),
      codeshares: getCodeshares(codeshares),
    });
  }

  /**
   * Compare to other
   * @param {*} other
   * @return {number}
   */
  compareTo(other) {
    const currentDepartureTime = new Date(this.departureTime).valueOf();
    const otherDepartureTime = new Date(other.departureTime).valueOf();

    if (currentDepartureTime === otherDepartureTime) {
      return 0;
    }

    if (currentDepartureTime < otherDepartureTime) {
      return -1;
    }
    return 1;
  }
}

module.exports = Flight;
