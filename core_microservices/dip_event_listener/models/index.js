const Contract = require('./Contract');
const Event = require('./Event');


module.exports = (db) => {
  Contract.knex(db);
  Event.knex(db);

  return {
    Contract,
    Event,
  };
};
