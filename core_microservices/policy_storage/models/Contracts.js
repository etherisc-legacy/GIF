const { Model } = require('objection');
const { schema, constants } = require('../knexfile');


const { CONTRACTS_TABLE } = constants;

/**
 * Contracts model
 */
class Contracts extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${CONTRACTS_TABLE}`;
  }

  /**
   * Identifier column
   * @return {String}
   */
  static get idColumn() {
    return 'key';
  }
}

module.exports = Contracts;
