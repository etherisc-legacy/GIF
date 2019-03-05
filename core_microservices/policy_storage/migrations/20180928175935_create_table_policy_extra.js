const { constants, triggers, schema } = require('../knexfile');


const { POLICY_TABLE, POLICY_EXTRA_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(POLICY_EXTRA_TABLE, (table) => {
  table.increments('id').primary();
  table.uuid('policyId').references('id').inTable(`${schema}.${POLICY_TABLE}`);
  table.string('field').notNullable();
  table.text('value').notNullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${POLICY_EXTRA_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(POLICY_EXTRA_TABLE);
