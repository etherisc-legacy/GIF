const { constants, triggers, schema } = require('../knexfile');


const { POLICY_TABLE, CUSTOMER_TABLE, DISTRIBUTOR_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(POLICY_TABLE, (table) => {
  table.uuid('id').notNullable().primary();
  table.string('customerId', 256).notNullable().references('id').inTable(`${schema}.${CUSTOMER_TABLE}`);
  table.uuid('distributorId').notNullable().references('id').inTable(`${schema}.${DISTRIBUTOR_TABLE}`);
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(POLICY_TABLE)));

exports.down = db => db.schema.withSchema(schema).dropTable(POLICY_TABLE);
