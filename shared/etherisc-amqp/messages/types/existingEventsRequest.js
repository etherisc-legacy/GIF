const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'existingEventsRequest',
  type: 'object',
  properties: {
    network: { type: 'string' },
  },
};

module.exports = schemaVersions;
