const dipMicroservice = require('dip-microservice');
const DipPolicyStorage = require('./DipPolicyStorage');


dipMicroservice.bootstrap(DipPolicyStorage, { httpPort: 3010 })
  .catch((err) => {
    throw new Error(err);
  });
