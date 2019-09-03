const { constants, schema } = require('../knexfile');


const { APPLICATIONS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).alterTable(APPLICATIONS_TABLE, (table) => {
  table.decimal('premium', 32, 0).alter();
  table.text('payoutOptions').alter();
});

exports.down = db => db.schema.withSchema(schema).alterTable(APPLICATIONS_TABLE, (table) => {
  table.integer('premium').alter();
  table.string('payoutOptions', 256).alter();
});
