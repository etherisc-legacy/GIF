const { constants, triggers } = require('../knexfile');


const { DISTRIBUTOR_TABLE } = constants;

exports.up = db => db.schema.createTable(DISTRIBUTOR_TABLE, (table) => {
  table.uuid('id').notNullable().primary();
  table.string('company', 256);
  table.timestamp('created').notNullable().defaultTo(db.fn.now());
  table.timestamp('updated').notNullable().defaultTo(db.fn.now());
})
  .then(() => db.raw(triggers.onUpdateTrigger.up(DISTRIBUTOR_TABLE)))
  .then(() => db(DISTRIBUTOR_TABLE).insert([
    {
      id: '11111111-1111-1111-1111-111111111111',
      company: 'Etherisc',
    },
  ]));

exports.down = db => db.schema.dropTable(DISTRIBUTOR_TABLE);
