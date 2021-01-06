const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'createCustomerResult',
  type: 'object',
  properties: {
    customerId: { type: 'string' },
  },
};

module.exports = schemaVersions;
