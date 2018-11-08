const { triggers } = require('../knexfile');


exports.up = (knex, Promise) => knex.schema.createTable('artifacts_storage.artifacts', (table) => {
  table.increments();
  table.string('product').notNullable();
  table.string('networkName').notNullable();
  table.string('version').notNullable();
  table.string('address', 42).notNullable();
  table.json('abi').notNullable();
  table.timestamp('created').notNullable().defaultTo(knex.fn.now());
  table.timestamp('updated').notNullable().defaultTo(knex.fn.now());
  table.unique(['networkName', 'address']);
})
  .then(() => knex.raw(triggers.onUpdateTrigger.up('artifacts_storage.artifacts')));

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('artifacts_storage.artifacts');
};
