const Product = require('./Product');
const User = require('./User');


module.exports = (db) => {
  Product.knex(db);
  User.knex(db);

  return {
    Product,
    User,
  };
};
