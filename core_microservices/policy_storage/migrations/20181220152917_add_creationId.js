const { constants, schema } = require('../knexfile');


const { POLICY_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).alterTable(POLICY_TABLE, (table) => {
  table.text('creationId');
});

exports.down = db => db.schema.withSchema(schema).alterTable(POLICY_TABLE, (table) => {
  table.dropColumn('creationId');
});
