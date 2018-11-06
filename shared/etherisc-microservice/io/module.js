const _ = require('lodash');
const Amqp = require('./amqp');
const Database = require('./db');
const HttpApp = require('./http');
const log = require('./log');
const S3 = require('./s3');


const { MESSAGE_BROKER } = process.env;

module.exports = (config) => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY || 'accesskey',
    secretAccessKey: process.env.AWS_SECRET_KEY || 'secretkey',
    endpoint: process.env.AWS_ENDPOINT || 'http://localhost:9000',
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  });
  const db = new Database(config.db);
  const http = new HttpApp(config.httpPort);

  const appName = _.last((process.env.npm_package_name || '').split('/'));
  const appVersion = process.env.npm_package_version;

  const amqp = new Amqp(MESSAGE_BROKER || 'amqp://localhost:5672', appName, appVersion, config.exchangeName);

  return {
    amqp, db, http, log, s3, appName, appVersion, config,
  };
};
