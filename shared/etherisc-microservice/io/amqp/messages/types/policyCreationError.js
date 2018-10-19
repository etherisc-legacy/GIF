const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'policyCreationError',
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
};

module.exports = schemaVersions;
