const { schema, constants } = require('../knexfile');


const { PRODUCTS_TABLE } = constants;

const productData = [{ name: 'fdd' }, { name: 'another_product' }];

exports.seed = (db) => {
  const inserts = productData.map((productEntry) => {
    const productsTable = db(`${schema}.${PRODUCTS_TABLE}`);
    const insert = productsTable.insert(productEntry);
    return db.raw(`${insert} ON CONFLICT (name) DO NOTHING`);
  });

  return Promise.all(inserts);
};
