const { schema, constants } = require('../knexfile');


const { CONTRACTS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).alterTable(CONTRACTS_TABLE, (table) => {
  table.string('contractName').notNullable().defaultTo('');
});

exports.down = db => db.schema.withSchema(schema).alterTable(CONTRACTS_TABLE, (table) => {
  table.dropColumn('contractName');
});
