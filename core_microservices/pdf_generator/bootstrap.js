require('dotenv').config({ path: '../.env' });
const { bootstrap } = require('@etherisc/microservice');
const PdfGenerator = require('./PdfGenerator');


bootstrap(PdfGenerator, {
  amqp: true,
  db: true,
  s3: true,
  bucket: 'dip-pdf-storage',
});
