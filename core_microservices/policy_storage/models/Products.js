const { Model } = require('objection');
const { schema, constants } = require('../knexfile');


const { PRODUCTS_TABLE } = constants;

/**
 * Products model
 */
class Products extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${PRODUCTS_TABLE}`;
  }

  /**
   * Identifier column
   * @return {String}
   */
  static get idColumn() {
    return 'key';
  }
}

module.exports = Products;
