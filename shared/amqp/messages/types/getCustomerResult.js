const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'getCustomerResult',
  type: 'object',
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    email: { type: 'string' },
  },
};

module.exports = schemaVersions;
