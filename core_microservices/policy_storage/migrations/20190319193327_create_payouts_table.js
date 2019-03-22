const { constants, triggers, schema } = require('../knexfile');


const { PAYOUTS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(PAYOUTS_TABLE, (table) => {
  table.string('key').notNullable().primary();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
  table.string('product');
  table.integer('contractKey');

  // on-chain data
  table.integer('productId').defaultTo(-1);
  table.integer('id').defaultTo(-1);
  table.integer('metadataId').defaultTo(-1);
  table.integer('claimId').defaultTo(-1);
  table.integer('expectedAmount').defaultTo(-1);
  table.integer('actualAmount').defaultTo(-1);
  table.integer('state').defaultTo(-1);
  table.string('stateMessage', 256);
  table.integer('createdAt').defaultTo(-1);
  table.integer('updatedAt').defaultTo(-1);
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${PAYOUTS_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(PAYOUTS_TABLE);
