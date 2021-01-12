const { Model } = require('objection');
const { schema, constants } = require('../knexfile');
const PayoutsExtra = require('./PayoutsExtra');


const {
  PAYOUTS_TABLE, PAYOUTS_EXTRA_TABLE,
} = constants;

/**
 * Payouts model
 */
class Payouts extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${PAYOUTS_TABLE}`;
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
        modelClass: PayoutsExtra,
        join: {
          from: `${schema}.${PAYOUTS_TABLE}.key`,
          to: `${schema}.${PAYOUTS_EXTRA_TABLE}.payoutKey`,
        },
      },
    };
  }
}

module.exports = Payouts;
