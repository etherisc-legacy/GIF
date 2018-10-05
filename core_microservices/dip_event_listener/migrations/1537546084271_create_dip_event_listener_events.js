exports.up = (pgm) => {
  pgm.createTable('dip_event_listener_events', {
    id: 'id',
    address: { type: 'varchar(42)', notNull: true },
    topics: { type: 'varchar(66)[]', notNull: true },
    data: { type: 'text', notNull: true },
    blockNumber: { type: 'serial', notNull: true },
    timeStamp: { type: 'timestamp', notNull: true },
    logIndex: { type: 'smallserial', notNull: true },
    transactionHash: { type: 'varchar(66)', notNull: true },
    transactionIndex: { type: 'smallserial', notNull: true },
    eventName: { type: 'varchar(255)', notNull: true, default: '' },
    eventArgs: { type: 'json', notNull: true, default: '{}' },
    networkName: { type: 'varchar(255)', notNull: true },
    version: { type: 'varchar(255)', notNull: true },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  }, {
    ifNotExists: true,
  });
  pgm.createIndex('dip_event_listener_events', ['networkName', 'transactionHash', 'logIndex'], { unique: true });
};

exports.down = (pgm) => {
  pgm.dropTable('dip_event_listener_events');
};
