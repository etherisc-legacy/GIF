const { schema, triggers, constants } = require('../knexfile');


const { EVENTS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(EVENTS_TABLE, (table) => {
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
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${EVENTS_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(EVENTS_TABLE);
