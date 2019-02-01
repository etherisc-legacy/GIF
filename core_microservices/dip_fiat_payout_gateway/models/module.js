const Payout = require('./Payout');


module.exports = (db) => {
  Payout.knex(db);

  return {
    Payout,
  };
};
