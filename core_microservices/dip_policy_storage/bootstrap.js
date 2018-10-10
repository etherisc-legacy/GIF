const { bootstrap, isDockerHost } = require('@etherisc/microservice');
const DipPolicyStorage = require('./DipPolicyStorage');


bootstrap(DipPolicyStorage, {
  httpPort: isDockerHost() && !process.env.CI ? 3000 : 3010,
});
