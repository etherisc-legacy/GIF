const Ajv = require('ajv');
const userController = require('./userController');
const productController = require('./productController');


module.exports = (dependencies) => {
  const { router } = dependencies;
  const controllerDependencies = { ...dependencies, ajv: new Ajv() };

  userController(controllerDependencies);
  productController(controllerDependencies);

  router.get('/api/health-check', async (ctx) => { ctx.ok(); });
};
