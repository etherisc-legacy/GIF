const { constants, triggers } = require('../knexfile');


const { CUSTOMER_TABLE, CUSTOMER_EXTRA_TABLE } = constants;

exports.up = db => db.schema.createTable(CUSTOMER_EXTRA_TABLE, (table) => {
  table.increments('id').primary();
  table.string('customerId', 256).references(`${CUSTOMER_TABLE}.id`);
  table.string('field').notNullable();
  table.text('value').notNullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(CUSTOMER_EXTRA_TABLE)));

exports.down = db => db.schema.dropTable(CUSTOMER_EXTRA_TABLE);
