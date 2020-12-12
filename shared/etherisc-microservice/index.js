const getPort = require('get-port-sync');
const { isDockerHost, isKubernetesHost } = require('./utils');
const knexfile = require('./knexfile');
const ioModule = require('./io/module');
const { DipMicroservice, GenericInsurance } = require('./services/module');


const requiredGlobalEnv = ['NODE_ENV', 'KUBERNETES_HTTP_PORT'];

/**
 * Check if all required env variables are set.
 * @param {array} requiredEnv
 */
function checkEnv(requiredEnv = []) {
  for (let idx = 0; idx < requiredEnv.length; idx += 1) {
    if (!process.env[requiredEnv[idx]]) throw new Error(`Required env variable not set (${requiredEnv[idx]})`);
  }
}

/**
 * Start application
 * @param {Class} App
 * @param {{}} config
 */
function bootstrap(App, config = { }) {
  if (!config.requiredEnv) throw new Error('requiredEnv not set');
  checkEnv(config.requiredEnv);
  checkEnv(requiredGlobalEnv);

  const ioConfig = {
    knexfile: knexfile(config.appName),
    ...config,
  };

  try {
    if (isKubernetesHost()) {
      ioConfig.httpPort = process.env.KUBERNETES_HTTP_PORT;
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
  if (!config.requiredEnv) throw new Error('requiredEnv not set');
  checkEnv(config.requiredEnv);
  checkEnv(requiredGlobalEnv);

  const ioConfig = {
    knexfile: knexfile(config.APP_NAME),
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
