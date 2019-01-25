require('dotenv').config();
const { bootstrap } = require('@etherisc/microservice');
const DipNotifications = require('./DipNotifications');


bootstrap(DipNotifications, {
  db: true,
  amqp: true,
  s3: true,
  bucket: 'dip-notification-templates', // TODO: pass in ENV ?
});
