
const getArtifactSchema = {
  properties: {
    product: { type: 'string' },
    networkName: { type: 'string' },
    contractName: { type: 'string' },
  },
  required: ['product', 'networkName', 'contractName'],
  additionalProperties: false,
};

const sendArtifactSchema = {
  properties: {
    product: { type: 'string' },
    network: { type: 'string' },
    networkId: { type: 'integer' },
    artifact: { type: 'string' },
    version: { type: 'string' },
  },
  required: ['product', 'network', 'networkId', 'artifact', 'version'],
  additionalProperties: false,
};

const contractCallSchema = {
  properties: {
    product: { type: 'string' },
    contractName: { type: 'string' },
    methodName: { type: 'string' },
    parameters: {},
  },
  required: ['product', 'contractName', 'methodName', 'parameters'],
  additionalProperties: false,
};


module.exports = async ({
  ajv,
  router,
  gifService,
}) => {
  // Get Contract Artifact
  router.get('/api/artifact/get', async (ctx) => {
    const validate = ajv.compile(getArtifactSchema);
    if (!validate(ctx.request.body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    const artifact = await gifService.getArtifact(ctx.request.body);

    ctx.ok(artifact);
  });

  router.post('/api/artifact/send', async (ctx) => {
    const validate = ajv.compile(sendArtifactSchema);
    if (!validate(ctx.request.body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    const result = await gifService.sendArtifact(ctx.request.body);

    ctx.ok(result);
  });

  router.get('/api/contract/call', async (ctx) => {
    const validate = ajv.compile(contractCallSchema);
    if (!validate(ctx.request.body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    const artifact = await gifService.callContract(ctx.request.body);

    ctx.ok(artifact);
  });
};
