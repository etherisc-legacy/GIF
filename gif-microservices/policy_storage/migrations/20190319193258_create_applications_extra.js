const { constants, triggers, schema } = require('../knexfile');


const { APPLICATIONS_TABLE, APPLICATIONS_EXTRA_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(APPLICATIONS_EXTRA_TABLE, (table) => {
  table.increments('key').primary();
  table.string('applicationKey').references('key').inTable(`${schema}.${APPLICATIONS_TABLE}`);
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());

  table.string('field').notNullable();
  table.text('value').notNullable();
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${APPLICATIONS_EXTRA_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(APPLICATIONS_EXTRA_TABLE);
