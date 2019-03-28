const { constants, schema } = require('../knexfile');


const { PRODUCTS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).alterTable(PRODUCTS_TABLE, (table) => {
  table.string('productOwner');
});

exports.down = db => db.schema.withSchema(schema).alterTable(PRODUCTS_TABLE, (table) => {
  table.dropColumn('productOwner');
});
