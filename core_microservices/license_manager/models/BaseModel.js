const { Model } = require('objection');
const { DbErrors } = require('objection-db-errors');

/**
 * Base for all product models
 */
class BaseModel extends DbErrors(Model) {}

module.exports = {
  BaseModel,
};
