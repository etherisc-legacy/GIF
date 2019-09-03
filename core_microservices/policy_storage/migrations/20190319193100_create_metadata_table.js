const { constants, triggers, schema } = require('../knexfile');


const { METADATA_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(METADATA_TABLE, (table) => {
  // todo: why don't we use incremental keys?
  table.string('key').notNullable().primary();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
  table.string('product');
  table.string('customerId');
  table.integer('contractKey');

  // on-chain data
  table.integer('productId').defaultTo(-1);
  table.integer('id').defaultTo(-1);
  table.integer('applicationId').defaultTo(-1);
  table.integer('policyId').defaultTo(-1);
  table.boolean('hasPolicy').defaultTo(false);
  table.boolean('hasApplication').defaultTo(false);
  table.string('tokenContract');
  table.integer('tokenId').defaultTo(-1);
  table.string('registryContract');
  table.integer('release').defaultTo(-1);
  table.integer('state').defaultTo(-1);
  table.string('stateMessage', 256);
  table.string('bpExternalKey');
  table.integer('createdAt').defaultTo(-1);
  table.integer('updatedAt').defaultTo(-1);
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${METADATA_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(METADATA_TABLE);
