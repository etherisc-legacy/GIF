const request = require('request-promise');


const {
  RABBIT_ADMIN_USERNAME, RABBIT_ADMIN_PASSWORD, RABBIT_API_HOST, RABBIT_API_PORT,
} = process.env;

/**
 * Rabbit MQ API service
 */
class RabbitAPIService {
  /**
     * constructor
     * @param {{}} dependencies
     */
  constructor(dependencies) {
    this.log = dependencies.log;

    this._auth = `Basic ${Buffer.from(`${RABBIT_ADMIN_USERNAME}:${RABBIT_ADMIN_PASSWORD}`).toString('base64')}`;
    this._baseUrl = `http://${RABBIT_API_HOST}:${RABBIT_API_PORT}/api`;
  }

  /**
   * Make an HTTP request to RabbitMQ management plugin API
   * @param {string} method
   * @param {string} path
   * @param {{}} data
   * @return {{}}
   */
  async makeRequest(method, path, data) {
    try {
      const options = {
        method,
        url: `${this._baseUrl}/${path}`,
        body: data,
        headers: {
          Accept: '*/*',
          'content-type': 'application/json',
          Authorization: this._auth,
        },
        json: true,
      };
      const response = await request(options);
      return { response };
    } catch (error) {
      return { error };
    }
  }

  /**
    * Register a new product in Rabbit with a provided generated password
    * @param {string} name
    * @param {string} password
    * @return {{}}
    */
  async register(name, password = this.generateRandomPassword()) {
    const body = { username: name, tags: 'product', password };
    const { error: creationError } = await this.makeRequest('PUT', `users/${name}`, body);

    if (creationError) { return { registrationError: `Failed to create AMQP user: ${creationError.message}` }; }

    const PRODUCT_PUBLIC_PERMISSIONS = {
      configure: '^$',
      write: 'EXCHANGE',
      read: '^$',
    };
    const PRODUCT_TRUSTED_PERMISSIONS = {
      configure: `${name}_.*`,
      write: `${name}_.*`,
      read: `^[EXCHANGE|${name}_.*]`,
    };

    const { error: publicPermissionsError } = await this.makeRequest('PUT', `permissions/public/${name}`, PRODUCT_PUBLIC_PERMISSIONS);
    const { error: trustedPermissionsError } = await this.makeRequest('PUT', `permissions/trusted/${name}`, PRODUCT_TRUSTED_PERMISSIONS);

    if (publicPermissionsError || trustedPermissionsError) {
      await this.makeRequest('DELETE', `users/${name}`, { username: name });
      return { registrationError: 'Failed to set AMQP permissions' };
    }

    return { password };
  }

  /**
    * Update product password ( creates the product if there were none, but does not set permissions)
    * @param {string} name
    * @param {string} password
    * @return {{}}
    */
  async updatePassword(name, password = this.generateRandomPassword()) {
    const body = { username: name, tags: 'product', password };
    const { error: creationError } = await this.makeRequest('PUT', `users/${name}`, body);
    if (creationError) { return { updateError: `Failed to update AMQP user: ${creationError.message}` }; }
    return { password };
  }

  /**
   * Generate random string
   * @param {integer} length
   * @return {string}
   */
  generateRandomPassword(length = 24) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return (new Array(length)).fill().map(_ => charset.charAt(Math.floor(Math.random() * charset.length))).join('');
  }
}

module.exports = RabbitAPIService;
