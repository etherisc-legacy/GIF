const _ = require('lodash');
const isDockerHost = require('is-docker');
const knexfile = require('./knexfile');
const ioModule = require('./io/module');
const DipMicroservice = require('./services/DipMicroservice');


/**
 * Start application
 * @param {class} App
 * @param {{}} config
 */
function bootstrap(App, config = { }) {
  const ioConfig = {
    db: knexfile,
    appName: _.last(process.env.npm_package_name.split('/')),
    appVersion: process.env.npm_package_version,
    exchangeName: 'POLICY',
    ...config,
  };
  // TODO: use an universal exchange for all 'topic' platform messages or make an exchanges list

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

/**
 * Create microservice instance
 * @param {Class} App
 * @param {{}} config
 * @return {DipMicroservice}
 */
function fabric(App, config = {}) {
  const ioConfig = {
    db: knexfile,
    ...config,
  };

  const ioDeps = ioModule(ioConfig);
  return new DipMicroservice(App, ioDeps);
}

module.exports = {
  bootstrap,
  fabric,
  isDockerHost,
  knexfile,
};
