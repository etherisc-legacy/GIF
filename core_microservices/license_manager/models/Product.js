const { Model } = require('objection');
const { constants, schema } = require('../knexfile');


const { PRODUCTS_TABLE } = constants;

/**
 * Product fields model
 */
class Product extends Model {
  /**
     * Get table name
     * @return {string}
     */
  static get tableName() {
    return `${schema}.${PRODUCTS_TABLE}`;
  }
}

module.exports = Product;
