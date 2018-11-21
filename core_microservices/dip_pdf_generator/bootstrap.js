const { bootstrap } = require('@etherisc/microservice');
const DipPdfGenerator = require('./DipPdfGenerator');


bootstrap(DipPdfGenerator, {
  amqp: true,
  db: true,
  s3: true,
  bucket: 'dip-pdf-storage',
});
