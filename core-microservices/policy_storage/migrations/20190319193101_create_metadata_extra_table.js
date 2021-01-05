const { constants, triggers, schema } = require('../knexfile');


const { METADATA_TABLE, METADATA_EXTRA_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(METADATA_EXTRA_TABLE, (table) => {
  table.increments('key').primary();
  table.string('metadataKey').references('key').inTable(`${schema}.${METADATA_TABLE}`);
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());

  table.string('field').notNullable();
  table.text('value').notNullable();
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${METADATA_EXTRA_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(METADATA_EXTRA_TABLE);
