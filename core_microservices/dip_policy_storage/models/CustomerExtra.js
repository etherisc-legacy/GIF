const { Model } = require('objection');
const { constants } = require('../knexfile');


const { CUSTOMER_EXTRA_TABLE } = constants;

/**
 * Customer extra fields model
 */
class CustomerExtra extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return CUSTOMER_EXTRA_TABLE;
  }
}

module.exports = CustomerExtra;
