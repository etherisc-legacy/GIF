const Contract = require('./Contract');


module.exports = (db) => {
  Contract.knex(db);

  return {
    Contract,
  };
};
