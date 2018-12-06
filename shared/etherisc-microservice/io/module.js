const Amqp = require('./amqp');
const Database = require('./db');
const HttpApp = require('./http');
const log = require('./log');
const S3 = require('./s3');
const WebSocket = require('./websocket');


const { MESSAGE_BROKER } = process.env;

module.exports = (config) => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY || 'accesskey',
    secretAccessKey: process.env.AWS_SECRET_KEY || 'secretkey',
    endpoint: process.env.AWS_ENDPOINT || 'http://localhost:9000',
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  });

  const db = new Database(config.knexfile);
  const http = new HttpApp(config.httpPort);

  /**
   * Create WebSocket endpoint
   * @param {Server} server
   * @return {WebSocket}
   */
  const websocket = server => new WebSocket({ server, config, log });

  const { appName, appVersion } = config;

  const amqp = new Amqp(
    config.messageBroker || MESSAGE_BROKER || 'amqp://platform:guest@localhost:5672/trusted',
    appName,
    appVersion,
  );

  return {
    amqp, db, http, log, s3, config, websocket,
  };
};
