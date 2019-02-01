const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'payout',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
    payoutAmount: { type: 'number' },
    cyrrency: { type: 'string' },
    provider: { type: 'string' },
  },
  required: ['policyId', 'payoutAmount', 'cyrrency', 'provider'],
};

module.exports = schemaVersions;
