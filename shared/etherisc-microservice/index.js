const isDockerHost = require('is-docker');
const knexfile = require('./knexfile');
const ioModule = require('./io/module');
const DipMicroservice = require('./services/DipMicroservice');

/**
 * Start application
 * @param {class} App
 * @param {{}} config
 */
function bootstrap(App, config = {}) {
  const ioConfig = {
    db: knexfile,
    ...config,
  };

  try {
    const ioDeps = ioModule(ioConfig);
    const microservice = new DipMicroservice(App, ioDeps);

    microservice.bootstrap().catch((err) => {
      ioDeps.log.error(err);

      if (err.exit) process.exit(1);
    });
  } catch (err) {
    console.error(err);

    if (err.exit) process.exit(1);
  }
}

module.exports = {
  bootstrap,
  isDockerHost,
  knexfile,
};
