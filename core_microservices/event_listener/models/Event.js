const { Model } = require('objection');
const { constants, schema } = require('../knexfile');


const { EVENTS_TABLE } = constants;

/**
 * Event fields model
 */
class Event extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${EVENTS_TABLE}`;
  }
}

module.exports = Event;
