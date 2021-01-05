const Password = require('objection-password')();
const { BaseModel } = require('./BaseModel');
const { constants, schema } = require('../knexfile');


const { USERS_TABLE } = constants;

/**
 * User fields model
 */
class User extends Password(BaseModel) {
  /**
     * Get table name
     * @return {string}
     */
  static get tableName() {
    return `${schema}.${USERS_TABLE}`;
  }
}

module.exports = User;
