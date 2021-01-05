const { constants, schema } = require('../knexfile');


const { CUSTOMER_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).alterTable(CUSTOMER_TABLE, (table) => {
  table.renameColumn('productName', 'product');
});

exports.down = db => db.schema.withSchema(schema).alterTable(CUSTOMER_TABLE, (table) => {
  table.renameColumn('product', 'productName');
});
