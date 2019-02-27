const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'applyForPolicySuccess',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
    contractApplicationId: { type: 'string' },
  },
};

module.exports = schemaVersions;
