const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'initializePaymentResult',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
    error: { type: 'string' },
  },
  required: ['policyId'],
};

module.exports = schemaVersions;
