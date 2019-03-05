const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'policyGetRequestError',
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
};

module.exports = schemaVersions;
