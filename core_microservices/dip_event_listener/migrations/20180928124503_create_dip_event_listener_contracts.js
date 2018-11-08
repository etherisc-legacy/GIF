const { triggers } = require('../knexfile');


exports.up = db => db.schema.createTable('event_listener.contracts', (table) => {
  table.increments();
  table.string('product').notNullable();
  table.string('networkName').notNullable();
  table.string('version').notNullable();
  table.string('address', 42).notNullable();
  table.json('abi').notNullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
  table.unique(['product', 'networkName', 'address']);
})
  .then(() => db.raw(triggers.onUpdateTrigger.up('event_listener.contracts')));

exports.down = db => db.schema.dropTable('event_listener.contracts');
