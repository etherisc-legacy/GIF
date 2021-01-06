const { Model } = require('objection');
const { schema, constants } = require('../knexfile');
const PoliciesExtra = require('./PoliciesExtra');


const {
  POLICIES_TABLE, POLICIES_EXTRA_TABLE,
} = constants;

/**
 * Policies model
 */
class Policies extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${POLICIES_TABLE}`;
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
        modelClass: PoliciesExtra,
        join: {
          from: `${schema}.${POLICIES_TABLE}.key`,
          to: `${schema}.${POLICIES_EXTRA_TABLE}.policyKey`,
        },
      },
    };
  }
}

module.exports = Policies;
