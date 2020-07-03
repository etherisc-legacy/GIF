const Amqp = require('@etherisc/amqp');
const Database = require('./db');
const HttpApp = require('./http');
const log = require('./log');
const S3 = require('./s3');
const WebSocket = require('./websocket');


const {
  AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_ENDPOINT,
  AMQP_HOST, AMQP_PORT, AMQP_USERNAME, AMQP_PASSWORD, AMQP_MODE,
} = process.env;

module.exports = (config) => {
  const s3 = new S3({
    accessKeyId: AWS_ACCESS_KEY || 'accesskey',
    secretAccessKey: AWS_SECRET_KEY || 'secretkey',
    endpoint: AWS_ENDPOINT || 'http://localhost:9000',
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  });

  const db = new Database(config.knexfile);
  const http = new HttpApp(config.httpPort, config.httpAdditionalMiddleware || []);

  /**
   * Create WebSocket endpoint
   * @param {Server} server
   * @return {WebSocket}
   */
  const websocket = server => new WebSocket({ server, config, log });

  const { appName, appVersion } = config;

  let amqpMode;
  switch (AMQP_MODE) {
    case 'product':
    case 'core':
    case 'license':
      amqpMode = AMQP_MODE;
      break;
    default:
      amqpMode = 'core';
  }
  const messageBrokerConfig = {
    mode: amqpMode,
    username: AMQP_USERNAME || 'platform',
    password: AMQP_PASSWORD || 'guest',
    host: AMQP_HOST || 'localhost',
    port: AMQP_PORT || '5672',
  };

  const amqp = new Amqp(
    messageBrokerConfig,
    appName,
    appVersion,
  );
  log.debug(`Connected in AMQP mode [${amqpMode}] with host ${messageBrokerConfig.host} at port ${messageBrokerConfig.port} appName=${appName} appVersion=${appVersion}`);

  return {
    amqp, db, http, log, s3, config, websocket,
  };
};
