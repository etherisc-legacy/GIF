const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'cardCharged',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
  },
};

module.exports = schemaVersions;
