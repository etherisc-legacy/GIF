const ProductSettings = require('./ProductSettings');


module.exports = (db) => {
  ProductSettings.knex(db);

  return {
    ProductSettings,
  };
};
