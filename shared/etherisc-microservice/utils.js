const isDockerHost = require('is-docker');

/**
 * Throw error
 * @param {*} e
 */
function throwError(e) {
  if (e instanceof Error) {
    throw e;
  } else {
    throw new Error(e);
  }
}

module.exports = {
  throwError,
  isDockerHost,
  isKubernetesHost: () => isDockerHost() && !process.env.CI,
};
