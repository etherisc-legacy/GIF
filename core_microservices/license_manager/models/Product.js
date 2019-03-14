const { BaseModel } = require('./BaseModel');
const { constants, schema } = require('../knexfile');


const { PRODUCTS_TABLE } = constants;

/**
 * Product fields model
 */
class Product extends BaseModel {
  /**
     * Get table name
     * @return {string}
     */
  static get tableName() {
    return `${schema}.${PRODUCTS_TABLE}`;
  }
}

module.exports = Product;
