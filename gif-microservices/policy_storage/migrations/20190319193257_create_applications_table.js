const { constants, triggers, schema } = require('../knexfile');


const { APPLICATIONS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(APPLICATIONS_TABLE, (table) => {
  table.string('key').notNullable().primary();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
  table.string('product');
  table.integer('contractKey');

  // on-chain data
  table.integer('productId').defaultTo(-1);
  table.integer('id').defaultTo(-1);
  table.integer('metadataId').defaultTo(-1);
  table.integer('premium').defaultTo(-1);
  table.string('currency', 256);
  table.string('payoutOptions', 256);
  table.integer('state').defaultTo(-1);
  table.string('stateMessage', 256);
  table.integer('createdAt').defaultTo(-1);
  table.integer('updatedAt').defaultTo(-1);
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${APPLICATIONS_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(APPLICATIONS_TABLE);
