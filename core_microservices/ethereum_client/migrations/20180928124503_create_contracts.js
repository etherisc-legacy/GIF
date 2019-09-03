const { schema, triggers, constants } = require('../knexfile');


const { CONTRACTS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(CONTRACTS_TABLE, (table) => {
  table.increments();
  table.string('product').notNullable();
  table.string('contractName').notNullable();
  table.string('networkName').notNullable();
  table.string('version').notNullable();
  table.string('address', 42).notNullable();
  table.json('abi').notNullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
  table.unique(['product', 'networkName', 'address']);
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${CONTRACTS_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(CONTRACTS_TABLE);
