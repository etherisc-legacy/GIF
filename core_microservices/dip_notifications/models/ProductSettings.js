const { Model } = require('objection');
const { schema, constants } = require('../knexfile');


const { PRODUCT_SETTINGS_TABLE } = constants;

/**
 * Product settings fields model
 */
class ProductSettings extends Model {
  /**
   * Get table name
   * @return {string}
   */
  static get tableName() {
    return `${schema}.${PRODUCT_SETTINGS_TABLE}`;
  }
}

module.exports = ProductSettings;
