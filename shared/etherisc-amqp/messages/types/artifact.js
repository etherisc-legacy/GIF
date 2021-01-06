const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'artifact',
  type: 'object',
  properties: {
    network: { type: 'string' },
    version: { type: 'string' },
    contract: { type: 'string' },
    artifact: { type: 'string' },
  },
};

module.exports = schemaVersions;
