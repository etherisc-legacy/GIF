const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'policyCreationSuccess',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
  },
};

module.exports = schemaVersions;
