const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'policyGetResponse',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
    id: { type: 'string' },
    customerId: { type: 'string' },
    distributorId: { type: 'string' },
    extra: { type: 'object' },
    customer: {
      firstname: { type: 'string' },
      lastname: { type: 'string' },
      email: { type: 'string' },
    },
  },
};

module.exports = schemaVersions;
