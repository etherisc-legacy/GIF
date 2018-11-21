const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'certificateIssued',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
  },
};

module.exports = schemaVersions;
