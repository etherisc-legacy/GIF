// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });
const { bootstrap } = require('@etherisc/microservice');
const PublishContracts = require('./PublishContracts');
const pkg = require('../package.json');


bootstrap(PublishContracts, {
  amqp: true,
  appName: pkg.name,
  appVersion: pkg.version,
});
