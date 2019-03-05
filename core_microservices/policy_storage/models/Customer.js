const { Model } = require('objection');
const { schema, constants } = require('../knexfile');
const Policy = require('./Policy');
const CustomerExtra = require('./CustomerExtra');


const {
  CUSTOMER_TABLE, CUSTOMER_EXTRA_TABLE, POLICY_TABLE,
} = constants;

/**
 * Customer model
 */
class Customer extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${CUSTOMER_TABLE}`;
  }

  /**
   * Relations to other Models
   * @return {{}}
   */
  static get relationMappings() {
    return {
      extra: {
        relation: Model.HasManyRelation,
        modelClass: CustomerExtra,
        join: {
          from: `${schema}.${CUSTOMER_TABLE}.id`,
          to: `${schema}.${CUSTOMER_EXTRA_TABLE}.customerId`,
        },
      },
      policies: {
        relation: Model.HasManyRelation,
        modelClass: Policy,
        join: {
          from: `${schema}.${CUSTOMER_TABLE}.id`,
          to: `${schema}.${POLICY_TABLE}.customerId`,
        },
      },
    };
  }
}

module.exports = Customer;
