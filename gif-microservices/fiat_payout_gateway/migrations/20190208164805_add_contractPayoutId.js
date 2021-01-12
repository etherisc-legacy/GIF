const { constants, schema } = require('../knexfile');


const { PAYOUT_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).alterTable(PAYOUT_TABLE, (table) => {
  table.integer('contractPayoutId').defaultTo(-1);
  table.index(['contractPayoutId']);
});

exports.down = db => db.schema.withSchema(schema).alterTable(PAYOUT_TABLE, (table) => {
  table.dropColumn('contractPayoutId');
});
