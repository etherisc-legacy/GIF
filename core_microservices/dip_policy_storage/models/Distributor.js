const { Model } = require('objection');
const { constants } = require('../knexfile');
const Policy = require('./Policy');


const { DISTRIBUTOR_TABLE, POLICY_TABLE } = constants;

/**
 * Distributor model
 */
class Distributor extends Model {
  /**
   * Get db table name
   * @return {string}
   */
  static get tableName() {
    return DISTRIBUTOR_TABLE;
  }

  /**
   * Get relations mappings
   * @return {{}}
   */
  static get relationMappings() {
    return {
      policies: {
        relation: Model.HasManyRelation,
        modelClass: Policy,
        join: {
          from: `${DISTRIBUTOR_TABLE}.id`,
          to: `${POLICY_TABLE}.distributorId`,
        },
      },
    };
  }
}

module.exports = Distributor;
