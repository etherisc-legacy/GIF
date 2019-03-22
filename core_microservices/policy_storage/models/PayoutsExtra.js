const { Model } = require('objection');
const { schema, constants } = require('../knexfile');


const { PAYOUTS_EXTRA_TABLE } = constants;

/**
 * Payouts extra fields model
 */
class PayoutsExtra extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${PAYOUTS_EXTRA_TABLE}`;
  }

  /**
   * Identifier column
   * @return {String}
   */
  static get idColumn() {
    return 'key';
  }
}

module.exports = PayoutsExtra;
