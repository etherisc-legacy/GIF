require('dotenv').config();
const { bootstrap } = require('@etherisc/microservice');
const Notifications = require('./Notifications');


bootstrap(Notifications, {
  db: true,
  amqp: true,
  s3: true,
  bucket: 'dip-notification-templates', // TODO: pass in ENV ?
});
