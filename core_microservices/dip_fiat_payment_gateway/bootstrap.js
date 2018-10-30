const { bootstrap, isDockerHost } = require('@etherisc/microservice');
const DipFiatPaymentGateway = require('./DipFiatPaymentGateway');


bootstrap(DipFiatPaymentGateway, {
  httpPort: isDockerHost() && !process.env.CI ? 3000 : 3014,
});
