const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'issueCertificate',
  type: 'object',
  properties: {
    policyId: { type: 'string' },
  },
};

module.exports = schemaVersions;
