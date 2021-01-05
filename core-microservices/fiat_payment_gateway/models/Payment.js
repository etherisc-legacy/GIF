const { Model } = require('objection');
const { constants, schema } = require('../knexfile');
const PaymentData = require('./PaymentData');


const {
  PAYMENTS_TABLE, PAYMENTS_DATA_TABLE,
} = constants;

/**
 * Payment model
 */
class Payment extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${PAYMENTS_TABLE}`;
  }

  /**
   * Get relations mappings
   * @return {{}}
   */
  static get relationMappings() {
    return {
      data: {
        relation: Model.HasManyRelation,
        modelClass: PaymentData,
        join: {
          from: `${schema}.${PAYMENTS_TABLE}.id`,
          to: `${schema}.${PAYMENTS_DATA_TABLE}.paymentId`,
        },
      },
    };
  }
}

module.exports = Payment;
