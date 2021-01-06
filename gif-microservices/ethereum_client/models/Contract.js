const { Model } = require('objection');
const { constants, schema } = require('../knexfile');


const { CONTRACTS_TABLE } = constants;

/**
 * Contract fields model
 */
class Contract extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${CONTRACTS_TABLE}`;
  }
}

module.exports = Contract;
