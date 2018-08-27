const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const debug = require('debug')('koa2:server');
const path = require('path');

const config = require('./config');
const routes = require('./routes');

const port = process.env.PORT || config.port;

const amqp = require('amqplib/callback_api');
const mqBroker = process.env.MESSAGE_BROKER || config.broker;

// error handler
onerror(app);

// middlewares
app.use(bodyparser())
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))
  .use(views(path.join(__dirname, '/views'), {
    options: {settings: {views: path.join(__dirname, 'views')}},
    map: {'pug': 'pug'},
    extension: 'pug'
  }))
  .use(router.routes())
  .use(router.allowedMethods());

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - $ms`)
});

let messageQueue = {};
amqp.connect(mqBroker, function(error, connection) {
    connection.createChannel(function(error, channel) {
        let exchangeName = 'GeneralTopic';

        channel.assertExchange(exchangeName, 'topic', {durable: true});

        messageQueue.publish = (message) => {
            let key = 'anonymous.info.v1';
            channel.publish(exchangeName, key, new Buffer.from(message));
            console.log(`[Write] ${key}: '${message}'`);
        };

        channel.assertQueue('', {exclusive: true}, function(err, {queue}) {
            channel.bindQueue(queue, exchangeName, '#');

            channel.consume(queue, function(message) {
                console.log(`[Read] ${message.fields.routingKey}: '${message.content.toString()}'`);
            }, {noAck: true});
        });

    });
});

routes(router, messageQueue);

app.on('error', function(err, ctx) {
  console.log(err);
  logger.error('server error', err, ctx)
});

module.exports = app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`)
});
