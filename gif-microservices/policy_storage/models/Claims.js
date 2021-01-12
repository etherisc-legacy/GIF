const { Model } = require('objection');
const { schema, constants } = require('../knexfile');
const ClaimsExtra = require('./ClaimsExtra');


const {
  CLAIMS_TABLE, CLAIMS_EXTRA_TABLE,
} = constants;

/**
 * Claims model
 */
class Claims extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${CLAIMS_TABLE}`;
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
        modelClass: ClaimsExtra,
        join: {
          from: `${schema}.${CLAIMS_TABLE}.key`,
          to: `${schema}.${CLAIMS_EXTRA_TABLE}.claimKey`,
        },
      },
    };
  }
}

module.exports = Claims;
