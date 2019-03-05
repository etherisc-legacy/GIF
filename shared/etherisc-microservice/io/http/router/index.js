const Router = require('koa-router');


module.exports = (controllers) => {
  const router = new Router();

  const { k8sController } = controllers;

  router
    .get('/ready', k8sController.ready)
    .get('/live', k8sController.live)
    .get('/version', k8sController.version);

  return router;
};
