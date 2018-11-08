const { bootstrap, isDockerHost } = require('@etherisc/microservice');
const DipEventLogging = require('./DipEventLogging');


bootstrap(DipEventLogging, {
  httpPort: isDockerHost() && !process.env.CI ? 3000 : 3016,
});
