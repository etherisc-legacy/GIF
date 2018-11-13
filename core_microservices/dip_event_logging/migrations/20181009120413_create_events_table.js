const { schema } = require('../knexfile');


exports.up = (knex, Promise) => knex.schema.withSchema(schema).createTable('events', (table) => {
  table.increments('id').unsigned().primary();

  table.dateTime('created_at').notNull().defaultTo(knex.fn.now());

  table.json('properties').defaultTo('{}').notNullable();
  table.json('fields').defaultTo('{}').notNullable();
  table.json('content').defaultTo('{}').notNullable();
});

exports.down = (knex, Promise) => knex.schema.withSchema(schema).dropTable('events');
