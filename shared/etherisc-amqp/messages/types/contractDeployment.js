const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'contractDeployment',
  type: 'object',
  properties: {
    network: { type: 'string' },
    networkId: { type: 'integer' },
    version: { type: 'string' },
    artifact: { type: 'string' },
  },
};

module.exports = schemaVersions;
