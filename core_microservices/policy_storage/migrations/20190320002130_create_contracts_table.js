const { constants, triggers, schema } = require('../knexfile');


const { CONTRACTS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(CONTRACTS_TABLE, (table) => {
  table.increments('key').primary();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
  table.string('product');
  table.string('networkName');
  table.string('version');
  table.string('address');
  table.string('contractName');
  table.text('abi');
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${CONTRACTS_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(CONTRACTS_TABLE);
