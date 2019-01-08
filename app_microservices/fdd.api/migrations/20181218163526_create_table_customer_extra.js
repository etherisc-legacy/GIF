const { constants, triggers, schema } = require('../knexfile');


const { CUSTOMER_TABLE, CUSTOMER_EXTRA_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(CUSTOMER_EXTRA_TABLE, (table) => {
  table.increments('id').primary();
  table.string('customerId', 256).references('id').inTable(`${schema}.${CUSTOMER_TABLE}`);
  table.string('field').notNullable();
  table.text('value').notNullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${CUSTOMER_EXTRA_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(CUSTOMER_EXTRA_TABLE);
