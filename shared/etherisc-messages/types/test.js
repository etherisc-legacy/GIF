const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'test',
  type: 'object',
  properties: {
    text: { type: 'string' },
  },
};

module.exports = schemaVersions;
