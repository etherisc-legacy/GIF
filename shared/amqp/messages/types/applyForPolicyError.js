const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'applyForPolicyError',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
  },
};

module.exports = schemaVersions;
