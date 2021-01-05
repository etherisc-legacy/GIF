const { constants, triggers, schema } = require('../knexfile');


const { POLICIES_TABLE, POLICIES_EXTRA_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(POLICIES_EXTRA_TABLE, (table) => {
  table.increments('key').primary();
  table.string('policyKey').references('key').inTable(`${schema}.${POLICIES_TABLE}`);
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());

  table.string('field').notNullable();
  table.text('value').notNullable();
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${POLICIES_EXTRA_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(POLICIES_EXTRA_TABLE);
