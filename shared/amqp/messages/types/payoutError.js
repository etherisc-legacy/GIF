const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'payoutError',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
    error: { type: 'string' },
  },
  required: ['policyId', 'error'],
};

module.exports = schemaVersions;
