const { Model } = require('objection');
const { constants, schema } = require('../knexfile');


const { PAYMENTS_DATA_TABLE } = constants;

/**
 * Payment data fields model
 */
class PaymentData extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${PAYMENTS_DATA_TABLE}`;
  }
}

module.exports = PaymentData;
