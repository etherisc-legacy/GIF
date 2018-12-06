const { schema, triggers, constants } = require('../knexfile');


const { ARTIFACTS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(ARTIFACTS_TABLE, (table) => {
  table.increments('id').primary();
  table.string('product').notNullable();
  table.string('networkName').notNullable();
  table.string('version').notNullable();
  table.string('address', 42).notNullable();
  table.json('abi').notNullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
  table.unique(['networkName', 'address']);
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${ARTIFACTS_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(ARTIFACTS_TABLE);
