
exports.up = function (knex, Promise) {
  return knex.raw('CREATE SCHEMA IF NOT EXISTS event_logging');
};

exports.down = function (knex, Promise) {
  return knex.raw('DROP SCHEMA IF EXISTS event_logging CASCADE');
};
