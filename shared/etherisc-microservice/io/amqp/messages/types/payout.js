const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'payout',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
    payoutAmount: { type: 'number' },
    cyrrency: { type: 'string' },
    provider: { type: 'string' },
    contractPayoutId: { type: 'number' },
  },
  required: ['policyId', 'payoutAmount', 'cyrrency', 'provider'],
};

module.exports = schemaVersions;
