const { constants, triggers, schema } = require('../knexfile');


const { PAYMENTS_TABLE, PAYMENTS_DATA_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(PAYMENTS_DATA_TABLE, (table) => {
  table.increments('id').primary();
  table.integer('paymentId').references('id').inTable(`${schema}.${PAYMENTS_TABLE}`);
  table.string('field').notNullable();
  table.text('value').notNullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${PAYMENTS_DATA_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(PAYMENTS_DATA_TABLE);
