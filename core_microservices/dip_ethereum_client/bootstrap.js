const { bootstrap, isDockerHost } = require('@etherisc/microservice');
const DipEthereumClient = require('./DipEtheremClient');


bootstrap(DipEthereumClient, {
  httpPort: isDockerHost() && !process.env.CI ? 3000 : 3013,
});
