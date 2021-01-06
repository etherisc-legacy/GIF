const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'payout',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
    payoutAmount: { type: 'number' },
    currency: { type: 'string' },
    provider: { type: 'string' },
    contractPayoutId: { type: 'string' },
  },
  required: ['policyId', 'payoutAmount', 'currency', 'provider', 'contractPayoutId'],
};

module.exports = schemaVersions;
