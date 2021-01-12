const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'getCustomer',
  type: 'object',
  properties: {
    id: { type: 'string' },
  },
  required: ['id'],
};

module.exports = schemaVersions;
