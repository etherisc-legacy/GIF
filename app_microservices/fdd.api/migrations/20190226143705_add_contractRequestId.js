const { constants, schema } = require('../knexfile');


const { POLICY_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).alterTable(POLICY_TABLE, (table) => {
  table.integer('contractRequestId').defaultTo(-1);
  table.index(['contractRequestId']);
  table.renameColumn('contractAppicationId', 'contractApplicationId');
});

exports.down = db => db.schema.withSchema(schema).alterTable(POLICY_TABLE, (table) => {
  table.dropColumn('contractRequestId');
  table.renameColumn('contractApplicationId', 'contractAppicationId');
});
