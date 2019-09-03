const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'pdfTemplatesUpdate',
  type: 'object',
  properties: {
    templates: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          body: { type: 'string' },
        },
      },
    },
  },
};

module.exports = schemaVersions;
