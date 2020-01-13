const os = require('os');
const fs = require('fs-jetpack');
const errorMessages = require('./errorMessages');

/**
 * Global Configuration
 */
class GlobalConfig {
  /**
   * Get config path
   * @return {string}
   */
  get configurationPath() {
    return `${os.homedir()}/.gifconfig.json`;
  }

  /**
   * Get config
   * @return {any}
   */
  get configuration() {
    return fs.read(this.configurationPath, 'json');
  }

  /**
   *
   * @return {null|*}
   */
  get token() {
    const { configuration } = this;

    if (configuration && configuration.user && configuration.user.token) {
      return configuration.user.token;
    }

    return null;
  }

  /**
   *
   * @return {{password: *, username: *}}
   */
  get credentials() {
    const { configuration } = this;

    if (!configuration.current) throw new Error(errorMessages.noCurrent);

    if (!configuration.products) throw new Error(errorMessages.invalidConfigurationFormat);

    const product = configuration.products[configuration.current];
    if (!product) throw new Error(errorMessages.invalidConfigurationFormat);

    const { amqpLogin, amqpPassword } = product;

    if (!amqpLogin) throw new Error(errorMessages.noAmqpLogin);
    if (!amqpPassword) throw new Error(errorMessages.noAmqpPassword);

    return {
      username: amqpLogin,
      password: amqpPassword,
    };
  }

  /**
   * Write config
   * @param {Object} config
   */
  configure(config) {
    fs.write(this.configurationPath, JSON.stringify(config, ' ', 4));
  }
}

module.exports = GlobalConfig;
