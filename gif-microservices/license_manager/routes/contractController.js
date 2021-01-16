
const getArtifactSchema = {
  properties: {
    product: { type: 'string' },
    networkName: { type: 'string' },
    contractName: { type: 'string' },
  },
  required: ['product', 'networkName', 'contractName'],
  additionalProperties: false,
};


module.exports = async ({
  ajv,
  router,
  log,
  gifService,
}) => {
  // Get Contract Artifact
  router.get('/api/artifact/get', async (ctx, data) => {
    console.log(ctx.request.body);
    const validate = ajv.compile(getArtifactSchema);
    if (!validate(ctx.request.body)) {
      ctx.badRequest({ error: validate.errors });
      return;
    }

    const artifact = await gifService.getArtifact(ctx.request.body);

    ctx.ok(artifact);
  });
};
