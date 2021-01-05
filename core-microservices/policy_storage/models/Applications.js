const { Model } = require('objection');
const { schema, constants } = require('../knexfile');
const ApplicationsExtra = require('./ApplicationsExtra');


const {
  APPLICATIONS_TABLE, APPLICATIONS_EXTRA_TABLE,
} = constants;

/**
 * Applications model
 */
class Applications extends Model {
  /**
   * Get table name
   * @return {String}
   */
  static get tableName() {
    return `${schema}.${APPLICATIONS_TABLE}`;
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
   * @return {Object}
   */
  static get relationMappings() {
    return {
      extra: {
        relation: Model.HasManyRelation,
        modelClass: ApplicationsExtra,
        join: {
          from: `${schema}.${APPLICATIONS_TABLE}.key`,
          to: `${schema}.${APPLICATIONS_EXTRA_TABLE}.applicationKey`,
        },
      },
    };
  }
}

module.exports = Applications;
