const Koa = require('koa');
const Router = require('koa-router');


const app = new Koa();
const router = new Router();

const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const path = require('path');
const config = require('./config');
const routes = require('./routes');


const messageQueue = require('./messages')(config);

// error handler
onerror(app);

// middlewares
app.use(bodyparser())
  .use(json())
  .use(logger())
  .use(require('koa-static')(`${__dirname}/public`))
  .use(views(path.join(__dirname, '/views'), {
    options: { settings: { views: path.join(__dirname, 'views') } },
    map: { pug: 'pug' },
    extension: 'pug',
  }))
  .use(router.routes())
  .use(router.allowedMethods());

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

routes(router, messageQueue);

app.on('error', (err, ctx) => {
  console.log(err);
  logger.error('server error', err, ctx);
});

module.exports = app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`);
});
