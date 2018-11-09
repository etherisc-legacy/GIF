const { triggers } = require('../knexfile');


exports.up = db => db.schema.createTable('event_listener.events', (table) => {
  table.increments();
  table.string('address', 42).notNullable();
  table.json('topics').notNullable();
  table.text('data').notNullable();
  table.bigInteger('blockNumber').notNullable();
  table.timestamp('timeStamp').notNullable();
  table.integer('logIndex').notNullable();
  table.string('transactionHash', 66).notNullable();
  table.integer('transactionIndex').notNullable();
  table.string('eventName').notNullable();
  table.json('eventArgs').notNullable();
  table.string('networkName').notNullable();
  table.string('version').notNullable();
  table.string('product').notNullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
  table.unique(['networkName', 'transactionHash', 'logIndex']);
})
  .then(() => db.raw(triggers.onUpdateTrigger.up('event_listener.events')));

exports.down = db => db.schema.dropTable('event_listener.events');