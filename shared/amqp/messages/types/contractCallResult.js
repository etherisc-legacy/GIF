const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'contractCallResult',
  type: 'object',
  properties: {
    product: { type: 'string' },
    contractName: { type: 'string' },
    methodName: { type: 'string' },
    key: { type: 'string' },
    networkName: { type: 'string' },
  },
};

module.exports = schemaVersions;
