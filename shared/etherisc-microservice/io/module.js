const Amqp = require('./amqp');
const log = require('./log');
const { http, router } = require('./http');

module.exports = () => ({
  amqp: new Amqp(),
  log,
  http,
  router,
});
