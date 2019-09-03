const { schema, triggers, constants } = require('../knexfile');


const { USERS_TABLE } = constants;

exports.up = db => db.schema.withSchema(schema).createTable(USERS_TABLE, (table) => {
  table.increments('id').primary();

  table.string('firstname').notNullable();
  table.string('lastname').notNullable();
  table.string('email').notNullable();
  table.string('password').notNullable();

  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());

  table.unique(['email']);
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(`${schema}.${USERS_TABLE}`)));

exports.down = db => db.schema.withSchema(schema).dropTable(USERS_TABLE);
