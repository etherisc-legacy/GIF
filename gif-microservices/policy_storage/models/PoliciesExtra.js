const { Model } = require('objection');
const { schema, constants } = require('../knexfile');


const { POLICIES_EXTRA_TABLE } = constants;

/**
 * Policies extra fields model
 */
class PoliciesExtra extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${POLICIES_EXTRA_TABLE}`;
  }

  /**
   * Identifier column
   * @return {String}
   */
  static get idColumn() {
    return 'key';
  }
}

module.exports = PoliciesExtra;
