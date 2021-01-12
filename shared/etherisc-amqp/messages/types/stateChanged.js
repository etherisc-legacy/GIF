const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'stateChanged',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
    state: { type: 'number' },
  },
};

module.exports = schemaVersions;
