const { Model } = require('objection');
const { schema, constants } = require('../knexfile');


const { POLICY_EXTRA_TABLE } = constants;

/**
 * Policy extra fields model
 */
class PolicyExtra extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${POLICY_EXTRA_TABLE}`;
  }
}

module.exports = PolicyExtra;
