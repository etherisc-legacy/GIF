const Koa = require('koa');
const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');
const Cors = require('kcors');
const Logger = require('koa-logger');
const healthCheck = require('./routes/healthCheck');
const exceptionHandler = require('./exceptionHandler');


const http = new Koa();
const router = new Router();

router.get('/metrics', healthCheck);

http
  .use(exceptionHandler)
  .use(new Logger())
  .use(new Cors())
  .use(new BodyParser())
  .use(router.routes())
  .use(router.allowedMethods());


module.exports = { http, router };
