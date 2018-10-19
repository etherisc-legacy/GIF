const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'artifactListRequest',
  type: 'object',
  properties: {
    network: { type: 'string' },
    version: { type: 'string' },
    contract: { type: 'string' },
  },
};

module.exports = schemaVersions;
