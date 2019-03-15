const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'getCustomerResult',
  type: 'object',
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['firstname', 'lastname', 'email'],
};

module.exports = schemaVersions;
