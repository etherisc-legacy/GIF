const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'notificationSettingsUpdate',
  type: 'object',
  properties: {
    transports: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          props: { type: 'object' },
          events: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
    templates: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          transport: { type: 'string' },
          template: { type: 'string' },
        },
      },
    },
  },
  required: ['trasports', 'templates'],
};

module.exports = schemaVersions;
