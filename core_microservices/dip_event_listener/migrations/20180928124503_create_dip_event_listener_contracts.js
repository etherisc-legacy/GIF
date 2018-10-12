const { constants, triggers } = require('../knexfile');


const { CONTRACTS_TABLE } = constants;

exports.up = db => db.schema.createTable(CONTRACTS_TABLE, (table) => {
  table.increments();
  table.string('networkName').notNullable();
  table.string('version').notNullable();
  table.string('address', 42).notNullable();
  table.json('abi').notNullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
  table.unique(['networkName', 'address']);
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(CONTRACTS_TABLE)));

exports.down = db => db.schema.dropTable(CONTRACTS_TABLE);
