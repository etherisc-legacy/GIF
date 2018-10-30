const { bootstrap, isDockerHost } = require('@etherisc/microservice');
const DipFiatPayoutGateway = require('./DipFiatPayoutGateway');


bootstrap(DipFiatPayoutGateway, {
  httpPort: isDockerHost() && !process.env.CI ? 3000 : 3015,
});
