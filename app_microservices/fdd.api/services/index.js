// const PolicyService = require('./policyService');
// const VersionService = require('./versionService');
// const CustomerService = require('./customerService');
const FlightService = require('./flightService');


module.exports = (deps) => {
  // const policyService = new PolicyService({ ...ioDeps, ...modelDeps });
  // const customerService = new CustomerService({ ...ioDeps, ...modelDeps });
  // const versionService = new VersionService({ ...ioDeps, ...modelDeps });
  const flightService = new FlightService({ ...deps });

  return {
    // policyService,
    // versionService,
    // customerService,
    flightService,
  };
};
