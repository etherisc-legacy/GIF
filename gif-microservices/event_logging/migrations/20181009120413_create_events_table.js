const { constants } = require('../knexfile');


const { EVENT_TABLE } = constants;

exports.up = db => db.schema.createTable(EVENT_TABLE, (table) => {
  table.increments('id').unsigned().primary();

  table.dateTime('created_at').notNull().defaultTo(db.fn.now());

  table.json('properties').defaultTo('{}').notNullable();
  table.json('fields').defaultTo('{}').notNullable();
  table.json('content').defaultTo('{}').notNullable();
});

exports.down = db => db.schema.dropTable(EVENT_TABLE);
