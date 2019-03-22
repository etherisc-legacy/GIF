const { Model } = require('objection');
const { schema, constants } = require('../knexfile');
const MetadataExtra = require('./MetadataExtra');


const {
  METADATA_TABLE, METADATA_EXTRA_TABLE,
} = constants;

/**
 * Metadata model
 */
class Metadata extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${METADATA_TABLE}`;
  }

  /**
   * Identifier column
   * @return {String}
   */
  static get idColumn() {
    return 'key';
  }


  /**
   * Get relations mappings
   * @return {{}}
   */
  static get relationMappings() {
    return {
      extra: {
        relation: Model.HasManyRelation,
        modelClass: MetadataExtra,
        join: {
          from: `${schema}.${METADATA_TABLE}.key`,
          to: `${schema}.${METADATA_EXTRA_TABLE}.metadataKey`,
        },
      },
    };
  }
}

module.exports = Metadata;
