const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'applyForPolicySuccess',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
    contractAppicationId: { type: 'string' },
  },
};

module.exports = schemaVersions;
