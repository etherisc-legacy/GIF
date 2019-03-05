const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'policyCreationSuccess',
  type: 'object',
  properties: {
    creationId: { type: 'string' },
    customerId: { type: 'string' },
    policyId: { type: 'string' },
  },
};

module.exports = schemaVersions;
