const uuid = require('uuid/v1');


const REQUEST_TIMEOUT = 10000;

/**
 * Call function on timeout
 * @param {Functoin} cb
 */
const scheduleTimeout = (cb) => {
  setTimeout(() => cb('Timeout'), REQUEST_TIMEOUT);
};

const docs = {
  info: `
    Information about the product
  `,
  'customers.create': `
    Create customer:
      - firstname (required)
      - lastname (required)
      - email (required)
      - examplefiled
    E.g. gif.customers.create({ firstname: 'Jow', lastname: 'Dow', email: 'example@email.com', age: 25 })  
  `,
  'customers.getById': `
    Get customer by id:
      - id (required)
    E.g. gif.customers.getById('eef381f42a369f42dd725c6a7cc8905');  
  `,
  'customers.list': `
    Get all customers:
    E.g. gif.customers.list()
  `,
};

/**
 * GIF client
 */
class Gif {
  /**
   * Constructor
   * @param {Amqp} amqp
   * @param {Object} info
   */
  constructor(amqp, info) {
    this._amqp = amqp;
    this._info = info;

    this.shutdown = this.shutdown.bind(this);
  }

  /**
   * Shutdown
   */
  shutdown() {
    this._amqp.closeConnections();
  }

  /**
   * CLI
   * @return {Object}
   */
  get cli() {
    return {
      info: this.info.bind(this),
      customers: {
        create: this.createCustomer.bind(this),
        getById: this.getCustomerById.bind(this),
        list: this.listCustomers.bind(this),
      },
      help: cmd => console.log(docs[cmd] || 'No documentation'),
    };
  }

  /* Info section */
  /**
   * Get product's info
   * @return {*}
   */
  info() {
    return this._info;
  }

  /* Customers section */

  /**
   * Greate customer request
   * @param {Object} payload
   * @return {Promise<any|{error: string}>}
   */
  async createCustomer(payload) {
    return this.request({
      payload,
      pubMessageType: 'createCustomer',
      subMessageType: 'createCustomerResult',
    });
  }

  /**
   * Get customer by id request
   * @param {String} customerId
   * @return {Promise<any|{error: string}>}
   */
  async getCustomerById(customerId) {
    return this.request({
      payload: {
        customerId,
      },
      pubMessageType: 'getCustomer',
      subMessageType: 'getCustomerResult',
    });
  }

  /**
   * Get list of customers request
   * @return {Promise<any|{error: string}>}
   */
  async listCustomers() {
    return this.request({
      payload: {},
      pubMessageType: 'listCustomers',
      subMessageType: 'listCustomersResult',
    });
  }

  /**
   * Request
   * @param {Object} params
   * @param {Object} params.payload
   * @param {String} params.pubMessageType
   * @param {String} params.subMessageType
   * @return {Promise<any | {error: string}>}
   */
  async request({ payload, pubMessageType, subMessageType }) {
    try {
      await this._amqp.createChannels();

      const requestId = uuid();

      const result = await new Promise((resolve, reject) => {
        this._amqp.consume({
          product: this._amqp.appName,
          messageType: subMessageType,
          messageVersion: '1.*',
          handler: ({ content, fields, properties }) => {
            if (properties.headers.requestId === requestId) {
              if (content.error) {
                reject(content);
              } else {
                resolve(content);
              }
            }

            scheduleTimeout(reject);
          },
        })
          .then(() => {
            this._amqp.publish({
              messageType: pubMessageType,
              messageVersion: '1.*',
              content: {
                ...payload,
              },
              customHeaders: {
                requestId,
              },
            }).catch(reject);
          })
          .catch(reject);
      })
        .catch(this.errorHandler);

      await this._amqp.closeChannels();

      return result;
    } catch (e) {
      this.errorHandler(e);
      return e;
    }
  }

  /**
   * Handle error
   * @param {Error} e
   * @return {{error: String}}
   */
  errorHandler(e) {
    return { error: e.message };
  }
  //
  // async getCustomerById() {
  //   const customer = {
  //     firstname: 'Joe',
  //     lastname: 'Dow',
  //     email: 'joe@dow.com',
  //   };
  //
  //   //console.table(customer);
  //
  //   return customer;
  // } // eslint-disable-line
  //
  // async getCustomers() {
  //   const customers = [
  //     {
  //       firstname: 'Joe',
  //       lastname: 'Dow',
  //       email: 'joe@dow.com',
  //     },
  //     {
  //       firstname: 'Joe2',
  //       lastname: 'Dow',
  //       email: 'joe2@dow.com',
  //     },
  //     {
  //       firstname: 'Joe3',
  //       lastname: 'Dow',
  //       email: 'joe3@dow.com',
  //     },
  //   ];
  //
  //   //console.table(customers);
  //
  //   return customers;
  // } // eslint-disable-line
  //
  // /* Applications */
  // createApplication() {} // eslint-disable-line
  //
  // getApplicationById() {} // eslint-disable-line
  //
  // getApplications() {} // eslint-disable-line
  //
  // /* Policies */
  // getPolicyById() {} // eslint-disable-line
  //
  // getPolicyByContractId() {} // eslint-disable-line
  //
  // getPolicies() {} // eslint-disable-line
  //
  // /* Claims */
  // getClaimById() {} // eslint-disable-line
  //
  // getClaims() {} // eslint-disable-line
  //
  // /* Payouts */
  // getPayoutById() {} // eslint-disable-line
  //
  // getPayouts() {} // eslint-disable-line
  //
  // /* Ethereum events */
  // subscribeToEvents() {} // eslint-disable-line
  //
  // /* Contract API */
  // sendTransactions() {} // eslint-disable-line
  //
  // callContract() {} // eslint-disable-line
  //
  // /* Notifications */
  // sendNotification() {} // eslint-disable-line
}

module.exports = Gif;
