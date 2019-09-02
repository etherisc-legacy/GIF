const { Model } = require('objection');
const { schema, constants } = require('../knexfile');


const { APPLICATIONS_EXTRA_TABLE } = constants;

/**
 * Applications extra fields model
 */
class ApplicationsExtra extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${APPLICATIONS_EXTRA_TABLE}`;
  }

  /**
   * Identifier column
   * @return {String}
   */
  static get idColumn() {
    return 'key';
  }
}

module.exports = ApplicationsExtra;
