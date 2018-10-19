exports.up = function (knex, Promise) {
  return knex.schema.createTable('event_logging.events', (table) => {
    table.increments('id').unsigned().primary();

    table.dateTime('created_at').notNull().defaultTo(knex.fn.now());

    table.json('properties').defaultTo('{}').notNullable();
    table.json('fields').defaultTo('{}').notNullable();
    table.json('content').defaultTo('{}').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('event_logging.events');
};
