const { schema, constants } = require('../knexfile');


const { CONTRACTS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).alterTable(CONTRACTS_TABLE, (table) => {
  table.string('transactionHash', 66).notNullable().defaultTo('');
  table.bigInteger('blockNumber').notNullable().defaultTo(0);
});

exports.down = db => db.schema.withSchema(schema).alterTable(CONTRACTS_TABLE, (table) => {
  table.dropColumn('transactionHash');
  table.dropColumn('blockNumber');
});
