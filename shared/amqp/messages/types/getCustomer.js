const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'getCustomer',
  type: 'object',
  properties: {
    customerId: { type: 'string' },
  },
};

module.exports = schemaVersions;
