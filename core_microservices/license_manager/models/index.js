const Product = require('./Product');


module.exports = (db) => {
  Product.knex(db);

  return {
    Product,
  };
};
