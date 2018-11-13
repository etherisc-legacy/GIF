const { bootstrap } = require('@etherisc/microservice');
const DipArtifactsStorage = require('./DipArtifactsStorage');


bootstrap(DipArtifactsStorage, {
  amqp: true,
  db: true,
  s3: true,
  bucket: 'dip-artifacts-storage',
});
