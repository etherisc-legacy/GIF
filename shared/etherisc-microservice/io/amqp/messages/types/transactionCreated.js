const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'transactionCreated',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
  },
};

module.exports = schemaVersions;
