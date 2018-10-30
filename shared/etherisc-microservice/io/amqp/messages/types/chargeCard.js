const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'chargeCard',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
  },
};

module.exports = schemaVersions;
