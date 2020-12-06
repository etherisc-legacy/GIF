require('dotenv').config({ path: '../.env' });
const { bootstrap } = require('@etherisc/microservice');
const PdfGenerator = require('./PdfGenerator');


const requiredEnv = [];

bootstrap(PdfGenerator, {
  amqp: true,
  db: true,
  s3: true,
  requiredEnv,
  bucket: 'dip-pdf-storage',
});
