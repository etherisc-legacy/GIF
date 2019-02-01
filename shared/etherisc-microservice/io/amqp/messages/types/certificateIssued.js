const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'certificateIssued',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
    bucket: { type: 'string' },
    path: { type: 'string' },
    type: { type: 'string' },
    name: { type: 'string' },
  },
};

module.exports = schemaVersions;
