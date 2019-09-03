const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'decodedEvent',
  type: 'object',
  properties: {
    address: { type: 'string', minLength: 42, maxLength: 42 },
    transactionHash: { type: 'string', minLength: 66, maxLength: 66 },
    data: { type: 'string' },
    eventName: { type: 'string' },
    networkName: { type: 'string' },
    version: { type: 'string' },

    topics: { type: 'array' },
    eventArgs: { type: 'object' },

    blockNumber: { type: 'string' },
    logIndex: { type: 'number' },
    transactionIndex: { type: 'number' },

    timeStamp: { type: 'string', format: 'date-time' },
    created: { type: 'string', format: 'date-time' },
    updated: { type: 'string', format: 'date-time' },
  },
};

module.exports = schemaVersions;
