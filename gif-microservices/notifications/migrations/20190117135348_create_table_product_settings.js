const { constants, triggers, schema } = require('../knexfile');


const { PRODUCT_SETTINGS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(PRODUCT_SETTINGS_TABLE, (table) => {
  table.increments();
  table.string('productId', 256).notNull();
  table.text('settings').nullable();
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
  table.unique(['productId']);
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${PRODUCT_SETTINGS_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(PRODUCT_SETTINGS_TABLE);
