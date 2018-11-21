const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'policyGetRequest',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
  },
};

module.exports = schemaVersions;
