const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'paidOut',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
    amount: { type: 'number' },
    contractPolicyId: { type: 'number' },
  },
  required: ['policyId'],
};

module.exports = schemaVersions;
