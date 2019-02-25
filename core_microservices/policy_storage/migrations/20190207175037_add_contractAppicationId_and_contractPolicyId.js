const { constants, schema } = require('../knexfile');


const { POLICY_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).alterTable(POLICY_TABLE, (table) => {
  table.integer('contractAppicationId').defaultTo(-1);
  table.integer('contractPolicyId').defaultTo(-1);
  table.index(['contractAppicationId']);
  table.index(['contractPolicyId']);
});

exports.down = db => db.schema.withSchema(schema).alterTable(POLICY_TABLE, (table) => {
  table.dropColumn('contractAppicationId');
  table.dropColumn('contractPolicyId');
});
