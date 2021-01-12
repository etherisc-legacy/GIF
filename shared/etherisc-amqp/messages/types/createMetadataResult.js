const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'createMetadataResult',
  type: 'object',
  properties: {
    id: { type: 'string' },
  },
};

module.exports = schemaVersions;
