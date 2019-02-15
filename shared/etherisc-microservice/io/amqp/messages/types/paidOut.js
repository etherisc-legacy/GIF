const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'paidOut',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
    amount: { type: 'number' },
    contractPayoutId: { type: 'number' },
    details: { type: 'object' },
  },
  required: ['policyId', 'amount', 'contractPayoutId'],
};

module.exports = schemaVersions;
