const { Model } = require('objection');
const { schema, constants } = require('../knexfile');


const { CHANGES_TABLE } = constants;

/**
 * Changes model
 */
class Changes extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${CHANGES_TABLE}`;
  }

  /**
   * Identifier column
   * @return {String}
   */
  static get idColumn() {
    return 'key';
  }
}

module.exports = Changes;
