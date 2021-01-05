const { Model } = require('objection');
const { schema, constants } = require('../knexfile');


const { CLAIMS_EXTRA_TABLE } = constants;

/**
 * Claims extra fields model
 */
class ClaimsExtra extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${CLAIMS_EXTRA_TABLE}`;
  }

  /**
   * Identifier column
   * @return {String}
   */
  static get idColumn() {
    return 'key';
  }
}

module.exports = ClaimsExtra;
