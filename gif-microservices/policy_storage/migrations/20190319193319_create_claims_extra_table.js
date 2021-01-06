const { constants, triggers, schema } = require('../knexfile');


const { CLAIMS_TABLE, CLAIMS_EXTRA_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(CLAIMS_EXTRA_TABLE, (table) => {
  table.increments('key').primary();
  table.string('claimKey').references('key').inTable(`${schema}.${CLAIMS_TABLE}`);
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());

  table.string('field').notNullable();
  table.text('value').notNullable();
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${CLAIMS_EXTRA_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(CLAIMS_EXTRA_TABLE);
