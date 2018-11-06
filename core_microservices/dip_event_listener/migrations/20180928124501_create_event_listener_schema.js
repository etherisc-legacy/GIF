
exports.up = function (knex, Promise) {
  return knex.raw('CREATE SCHEMA IF NOT EXISTS event_listener');
};

exports.down = function (knex, Promise) {
  return knex.raw('DROP SCHEMA IF EXISTS event_listener CASCADE');
};
