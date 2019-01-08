const { Model } = require('objection');
const { schema, constants } = require('../knexfile');
const PolicyExtra = require('./PolicyExtra');


const { POLICY_TABLE, POLICY_EXTRA_TABLE } = constants;

/**
 * Policy model
 */
class Policy extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${POLICY_TABLE}`;
  }

  /**
   * Get relations mappings
   * @return {{}}
   */
  static get relationMappings() {
    return {
      extra: {
        relation: Model.HasManyRelation,
        modelClass: PolicyExtra,
        join: {
          from: `${schema}.${POLICY_TABLE}.id`,
          to: `${schema}.${POLICY_EXTRA_TABLE}.policyId`,
        },
      },
    };
  }
}

module.exports = Policy;
