const { constants, triggers } = require('../knexfile');


const { POLICY_TABLE, CUSTOMER_TABLE, DISTRIBUTOR_TABLE } = constants;

exports.up = db => db.schema.createTable(POLICY_TABLE, (table) => {
  table.uuid('id').notNullable().primary();
  table.string('customerId', 256).notNullable().references(`${CUSTOMER_TABLE}.id`);
  table.uuid('distributorId').notNullable().references(`${DISTRIBUTOR_TABLE}.id`);
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(POLICY_TABLE)));

exports.down = db => db.schema.dropTable(POLICY_TABLE);
