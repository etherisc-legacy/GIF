const { constants, triggers, schema } = require('../knexfile');


const { PAYOUT_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(PAYOUT_TABLE, (table) => {
  table.increments();
  table.integer('policyId').notNullable();
  table.string('provider', 356).notNullable();
  table.enu('status', ['new', 'in_progress', 'failed', 'finished'], { useNative: true, enumName: 'payout_status_type' }).notNullable().defaultTo('new');
  table.string('currency', 256).notNullable();
  table.integer('payoutAmount').notNullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${PAYOUT_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(PAYOUT_TABLE);
