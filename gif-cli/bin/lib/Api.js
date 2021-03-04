const axios = require('axios');

/**
 * Gif API
 */
class Api {
  /**
   * Constructor
   * @param {String} baseUrl
   */
  constructor(baseUrl) {
    this.client = axios.create({
      baseURL: baseUrl,
    });
  }

  /**
   * Set auth token
   * @param {String} token
   */
  setAuthToken(token) {
    this.client.defaults.headers.Authorization = `Bearer ${token}`;
  }

  /**
   * Get artifacts
   * @param {String} product
   * @param {String} networkName
   * @param {String} contractName
   * @return {Promise<any|{error: string}>}
   */
  async getArtifact(product, networkName, contractName) {
    if (!product || !networkName || !contractName) {
      return this.wrongArgument('gif.artifact.get');
    }
    return this.client.get('/api/artifact/get', { data: { product, networkName, contractName } });
  }

  /**
   * Get artifacts
   * @param {String} product
   * @param {String} network
   * @param {number} networkId
   * @param {{}} artifact
   * @param {string} version
   * @return {Promise<any|{error: string}>}
   */
  async sendArtifact({
    product, network, networkId, artifact, version,
  }) {
    if (!product || !network || !networkId || !artifact || !version) {
      return this.wrongArgument('gif.artifact.send');
    }
    return this.client.post('/api/artifact/send', {
      product, network, networkId, artifact, version,
    });
  }

  /**
   * Register new user
   * @param {String} firstname
   * @param {String} lastname
   * @param {String} email
   * @param {String} password
   * @return {*}
   */
  register(firstname, lastname, email, password) {
    return this.client.post('/api/users', {
      firstname, lastname, email, password,
    });
  }

  /**
   * Login user with credentials
   * @param {String} email
   * @param {String} password
   * @return {*}
   */
  login(email, password) {
    return this.client.post('/api/users/login', { email, password });
  }

  /**
   * Get User Profile data
   * @param {number} id
   * @return {*}
   */
  profile(id) {
    return this.client.get('/api/users/profile', { id });
  }

  /**
   * Create new product
   * @param {String} name
   * @return {*}
   */
  createProduct(name) {
    return this.client.post('/api/products', { name });
  }

  /**
   * Get list of products
   * @return {*}
   */
  getProducts() {
    return this.client.get('/api/products');
  }
}

module.exports = Api;
