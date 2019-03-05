const { constants, schema } = require('../knexfile');


const { POLICY_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).alterTable(POLICY_TABLE, (table) => {
  table.renameColumn('contractAppicationId', 'contractApplicationId');
});

exports.down = db => db.schema.withSchema(schema).alterTable(POLICY_TABLE, (table) => {
  table.renameColumn('contractApplicationId', 'contractAppicationId');
});
