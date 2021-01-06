const { Model } = require('objection');
const { schema, constants } = require('../knexfile');


const { PAYOUT_TABLE } = constants;

/**
 * Payout fields model
 */
class Payout extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${PAYOUT_TABLE}`;
  }
}

module.exports = Payout;
