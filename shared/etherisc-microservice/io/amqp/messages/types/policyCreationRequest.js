const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'policyCreationRequest',
  type: 'object',
  properties: {
    payload: { type: 'object' },
  },
};

module.exports = schemaVersions;
