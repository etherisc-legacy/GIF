const { bootstrap, isDockerHost } = require('@etherisc/microservice');
const DipArtifactsStorage = require('./DipArtifactsStorage');


bootstrap(DipArtifactsStorage, {
  httpPort: isDockerHost() && !process.env.CI ? 3000 : 3012,
  bucket: 'dip-artifacts-storage',
});
