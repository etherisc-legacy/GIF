const { constants, triggers, schema } = require('../knexfile');


const { PRODUCTS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(PRODUCTS_TABLE, (table) => {
  table.increments('key').primary();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
  table.string('product');

  // on-chain data
  table.integer('productId').defaultTo(-1);
  table.string('name');
  table.string('addr');
  table.string('policyFlow');
  table.integer('release').defaultTo(-1);
  table.string('policyToken');
  table.boolean('approved');
  table.boolean('paused');
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${PRODUCTS_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(PRODUCTS_TABLE);
