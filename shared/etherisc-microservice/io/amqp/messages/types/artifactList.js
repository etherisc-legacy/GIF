const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'artifactList',
  type: 'object',
  properties: {
    network: { type: 'string' },
    version: { type: 'string' },
    list: { type: 'array' },
  },
};

module.exports = schemaVersions;
