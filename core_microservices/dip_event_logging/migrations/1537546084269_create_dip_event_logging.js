exports.up = (pgm) => {
  pgm.createTable('dip_event_logging', {
    id: 'id',
    properties: { type: 'json', notNull: true },
    fields: { type: 'json', notNull: true },
    content: { type: 'json', notNull: true },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  }, {
    ifNotExists: true,
  });
};

exports.down = (pgm) => {
  pgm.dropTable('dip_event_logging');
};
