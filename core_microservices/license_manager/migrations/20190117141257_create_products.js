const { schema, triggers, constants } = require('../knexfile');


const { PRODUCTS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(PRODUCTS_TABLE, (table) => {
  table.increments('id').primary();
  table.string('name').notNullable();

  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());

  table.unique(['name']);
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${PRODUCTS_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(PRODUCTS_TABLE);
