const { constants, triggers, schema } = require('../knexfile');


const { CHANGES_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(CHANGES_TABLE, (table) => {
  table.increments('key').primary();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());

  table.string('entity');
  table.text('prev');
  table.text('next');
  table.integer('blockNumber');
  table.integer('contractKey');
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${CHANGES_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(CHANGES_TABLE);
