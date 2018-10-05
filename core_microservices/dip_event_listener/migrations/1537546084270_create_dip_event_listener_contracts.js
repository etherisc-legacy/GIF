exports.up = (pgm) => {
  pgm.createTable('dip_event_listener_contracts', {
    id: 'id',
    networkName: { type: 'varchar(255)', notNull: true },
    version: { type: 'varchar(255)', notNull: true },
    address: { type: 'varchar(42)', notNull: true },
    abi: { type: 'text', notNull: true },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  }, {
    ifNotExists: true,
  });
  pgm.createIndex('dip_event_listener_contracts', ['networkName', 'address'], { unique: true });
};

exports.down = (pgm) => {
  pgm.dropTable('dip_event_listener_contracts');
};
