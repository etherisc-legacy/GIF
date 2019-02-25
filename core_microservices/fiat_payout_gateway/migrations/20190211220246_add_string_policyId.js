const { constants, schema } = require('../knexfile');


const { PAYOUT_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).alterTable(PAYOUT_TABLE, (table) => {
  table.string('policyId').notNullable().defaultTo('').alter();
  table.index(['policyId']);
});

exports.down = db => db.schema.withSchema(schema).alterTable(PAYOUT_TABLE, (table) => {
  table.integer('policyId').notNullable().defaultTo(-1).alter();
});
