const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'policyCreationRequest',
  type: 'object',
  properties: {
    creationId: { type: 'string' },
    customer: {
      type: 'object',
      properties: {
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        email: { type: 'string', format: 'email' },
      },
      required: ['firstname', 'lastname', 'email'],
    },
    policy: {
      type: 'object',
      properties: {
        distributorId: { type: 'string' },
      },
      required: ['distributorId'],
    },
    payment: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['fiat'] },
        currency: { type: 'string', enum: ['usd', 'eur', 'gbp'] },
        premium: { type: 'integer' },
        gateway: {
          type: 'object',
          properties: {
            provider: { type: 'string', enum: ['stripe'] },
            sourceId: { type: 'string' },
          },
          dependencies: {
            sourceId: {
              properties: {
                provider: { type: 'string', enum: ['stripe'] },
              },
            },
          },
          required: ['provider'],
        },
      },
      dependencies: {
        gateway: {
          properties: {
            kind: { type: 'string', enum: ['fiat'] },
          },
        },
      },
      required: ['kind', 'currency', 'premium', 'provider'],
    },
  },
  required: ['customer', 'policy', 'payment'],
  additionalProperties: false,
};

module.exports = schemaVersions;
