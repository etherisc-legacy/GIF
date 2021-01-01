require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });
const { bootstrap } = require('@etherisc/microservice');
const PdfGenerator = require('./PdfGenerator');


const requiredEnv = [];

bootstrap(PdfGenerator, {
  amqp: true,
  db: true,
  s3: true,
  appName: process.env.APP_NAME,
  appVersion: process.env.APP_VERSION,
  requiredEnv,
  bucket: 'dip-pdf-storage',
});
