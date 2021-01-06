const { schema, constants } = require('../knexfile');


const { PRODUCTS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).alterTable(PRODUCTS_TABLE, (table) => {
  table.integer('userId');
  table.index(['userId']);
});

exports.down = db => db.schema.withSchema(schema).alterTable(PRODUCTS_TABLE, (table) => {
  table.dropColumn('userId');
});
