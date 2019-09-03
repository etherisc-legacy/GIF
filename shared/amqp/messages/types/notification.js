const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'notification',
  type: 'object',
  properties: {
    type: { type: 'string' },
    data: { type: 'object' },
    props: { type: 'object' },
  },
  required: ['type', 'data'],
};

module.exports = schemaVersions;
