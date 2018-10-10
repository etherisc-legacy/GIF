const { Model } = require('objection');
const { constants } = require('../knexfile');


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
    return POLICY_EXTRA_TABLE;
  }
}

module.exports = PolicyExtra;
