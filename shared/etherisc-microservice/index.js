const getPort = require('get-port-sync');
const _ = require('lodash');
const { isDockerHost, isKubernetesHost } = require('./utils');
const knexfile = require('./knexfile');
const ioModule = require('./io/module');
const { DipMicroservice, GenericInsurance } = require('./services/module');


const KUBERNETES_HTTP_PORT = 3000;

/**
 * Start application
 * @param {Class} App
 * @param {{}} config
 */
function bootstrap(App, config = { }) {
  const ioConfig = {
    knexfile,
    appName: config.appName || _.last(process.env.npm_package_name.split('/')),
    appVersion: config.appVersion || process.env.npm_package_version,
    exchangeName: config.exchangeName || 'POLICY', // TODO: use an universal exchange for all 'topic' platform messages or make an exchanges list
    ...config,
  };

  try {
    if (isKubernetesHost()) {
      ioConfig.httpPort = KUBERNETES_HTTP_PORT;
    } else {
      ioConfig.httpPort = ioConfig.httpDevPort || getPort();
    }

    const ioDeps = ioModule(ioConfig);
    const services = { GenericInsurance };
    const microservice = new DipMicroservice(App, ioDeps, services);

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
    knexfile,
    appName: config.appName || _.last(process.env.npm_package_name.split('/')),
    appVersion: config.appVersion || process.env.npm_package_version,
    exchangeName: config.exchangeName || 'POLICY', // TODO: use an universal exchange for all 'topic' platform messages or make an exchanges list
    ...config,
  };

  const ioDeps = ioModule(ioConfig);
  const services = { GenericInsurance };
  return new DipMicroservice(App, ioDeps, services);
}

module.exports = {
  bootstrap,
  fabric,
  isDockerHost,
  isKubernetesHost,
  knexfile,
};
