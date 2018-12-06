const { constants, triggers, schema } = require('../knexfile');


const { CUSTOMER_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(CUSTOMER_TABLE, (table) => {
  table.string('id', 256).notNullable().primary();
  table.string('firstname', 256);
  table.string('lastname', 256);
  table.string('email', 256);
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${CUSTOMER_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(CUSTOMER_TABLE);
