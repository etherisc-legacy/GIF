const { schema, triggers } = require('../knexfile');


exports.up = db => db.schema.withSchema(schema).createTable('artifacts', (table) => {
  table.increments();
  table.string('product').notNullable();
  table.string('networkName').notNullable();
  table.string('version').notNullable();
  table.string('address', 42).notNullable();
  table.json('abi').notNullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
  table.unique(['networkName', 'address']);
})
  .then(() => db.raw(triggers.onUpdateTrigger.up('artifacts')));

exports.down = db => db.schema.withSchema(schema).dropTable('artifacts');
