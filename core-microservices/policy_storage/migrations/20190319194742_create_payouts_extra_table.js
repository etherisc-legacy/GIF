const { constants, triggers, schema } = require('../knexfile');


const { PAYOUTS_TABLE, PAYOUTS_EXTRA_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(PAYOUTS_EXTRA_TABLE, (table) => {
  table.increments('key').primary();
  table.string('payoutKey').references('key').inTable(`${schema}.${PAYOUTS_TABLE}`);
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());

  table.string('field').notNullable();
  table.text('value').notNullable();
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${PAYOUTS_EXTRA_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(PAYOUTS_EXTRA_TABLE);
