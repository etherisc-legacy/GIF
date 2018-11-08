
exports.up = function (knex, Promise) {
  return knex.raw('CREATE SCHEMA IF NOT EXISTS artifacts_storage');
};

exports.down = function (knex, Promise) {
  return knex.raw('DROP SCHEMA IF EXISTS artifacts_storage CASCADE');
};
