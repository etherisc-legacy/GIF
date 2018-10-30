const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'payout',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
  },
};

module.exports = schemaVersions;
