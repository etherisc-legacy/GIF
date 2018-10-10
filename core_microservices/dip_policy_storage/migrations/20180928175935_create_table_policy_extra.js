const { constants, triggers } = require('../knexfile');


const { POLICY_TABLE, POLICY_EXTRA_TABLE } = constants;

exports.up = db => db.schema.createTable(POLICY_EXTRA_TABLE, (table) => {
  table.increments('id').primary();
  table.uuid('policyId').references(`${POLICY_TABLE}.id`);
  table.string('field').notNullable();
  table.text('value').notNullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(POLICY_EXTRA_TABLE)));

exports.down = db => db.schema.dropTable(POLICY_EXTRA_TABLE);
