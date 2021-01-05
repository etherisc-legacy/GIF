const { Model } = require('objection');
const { schema, constants } = require('../knexfile');


const { METADATA_EXTRA_TABLE } = constants;

/**
 * Metadata extra fields model
 */
class MetadataExtra extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${METADATA_EXTRA_TABLE}`;
  }

  /**
   * Identifier column
   * @return {String}
   */
  static get idColumn() {
    return 'key';
  }
}

module.exports = MetadataExtra;
