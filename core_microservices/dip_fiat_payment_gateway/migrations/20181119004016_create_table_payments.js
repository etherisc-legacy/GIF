const { constants, triggers, schema } = require('../knexfile');


const { PAYMENTS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(PAYMENTS_TABLE, (table) => {
  table.increments('id').primary();
  table.uuid('policyId');
  table.string('provider', 256);
  table.integer('premium');
  table.string('currency', 256);
  table.string('status', 256);
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(PAYMENTS_TABLE)));

exports.down = db => db.schema.withSchema(schema).dropTable(PAYMENTS_TABLE);
