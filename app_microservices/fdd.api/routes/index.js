const Ajv = require('ajv');
const flightController = require('./flightController');
const issueCertificateController = require('./issueCertificateController');
const couponController = require('./couponController');
const customerController = require('./customerController');
const policyController = require('./policyController');
const versionController = require('./versionController');


module.exports = (deps) => {
  const { router } = deps;
  const controllerDeps = { ...deps, ajv: new Ajv() };

  versionController(controllerDeps);
  policyController(controllerDeps);
  flightController(controllerDeps);
  customerController(controllerDeps);
  couponController(controllerDeps);
  issueCertificateController(controllerDeps);

  router.get('/api/health-check', async (ctx) => { ctx.ok(); });
};
