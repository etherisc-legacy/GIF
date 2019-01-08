const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'policyCreationError',
  type: 'object',
  properties: {
    creationId: { type: 'string' },
    customerId: { type: 'string' },
    error: { type: 'string' },
  },
};

module.exports = schemaVersions;
