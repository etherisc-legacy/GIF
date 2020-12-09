require('dotenv').config({ path: `./env.${process.env.NODE_ENV}` });
const { bootstrap } = require('@etherisc/microservice');
const Notifications = require('./Notifications');


const requiredEnv = ['SMTP_USERNAME', 'SMTP_PASSWORD', 'SMTP_HOST', 'SMTP_USE_SSL', 'BOT_TOKEN'];

bootstrap(Notifications, {
  db: true,
  amqp: true,
  s3: true,
  requiredEnv,
  bucket: 'dip-notification-templates', // TODO: pass in ENV ?
});
