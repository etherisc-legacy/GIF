const { schema } = require('../knexfile');


exports.up = db => db.schema.withSchema(schema).createTable('events', (table) => {
  table.increments('id').unsigned().primary();

  table.dateTime('created_at').notNull().defaultTo(db.fn.now());

  table.json('properties').defaultTo('{}').notNullable();
  table.json('fields').defaultTo('{}').notNullable();
  table.json('content').defaultTo('{}').notNullable();
});

exports.down = db => db.schema.withSchema(schema).dropTable('events');
