const schemaVersions = {};

schemaVersions['1.0'] = {
  id: 'contractTransactionResult',
  type: 'object',
  properties: {
    product: { type: 'string' },
    contractName: { type: 'string' },
    methodName: { type: 'string' },
    key: { type: 'string' },
    result: { type: 'object' },
    networkName: { type: 'string' },
  },
};

module.exports = schemaVersions;
