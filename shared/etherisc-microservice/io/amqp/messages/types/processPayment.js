const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'processPayment',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
  },
};

module.exports = schemaVersions;
