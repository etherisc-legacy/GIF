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
    return this.client.post('/api/users/profile', { id });
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
