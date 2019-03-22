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
   * @param {Object} eth
   */
  constructor(amqp, info, eth) {
    this._amqp = amqp;
    this._info = info;
    this._eth = eth;
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
      artifacts: {
        send: this.sendArtifacts.bind(this),
      },
      contract: {
        send: this.sendTransaction.bind(this),
        call: this.callContract.bind(this),
        onEvent: this.onEvent.bind(this),
      },
      customers: {
        create: this.createCustomer.bind(this),
        getById: this.getById('Customer').bind(this),
        list: this.list('Customers').bind(this),
      },
      bp: {
        create: this.createBp.bind(this),
        getById: this.getById('Metadata').bind(this),
        list: this.list('Metadata').bind(this),
      },
      application: {
        getById: this.getById('Application').bind(this),
        list: this.list('Applications').bind(this),
      },
      policy: {
        getById: this.getById('Policy').bind(this),
        list: this.list('Policies').bind(this),
      },
      claim: {
        getById: this.getById('Claim').bind(this),
        list: this.list('Claims').bind(this),
      },
      payout: {
        getById: this.getById('Payout').bind(this),
        list: this.list('Payouts').bind(this),
      },
      product: {
        get: this.getProduct.bind(this),
      },
      help: cmd => console.log(docs[cmd] || 'No documentation'),
      shutdown: this.shutdown.bind(this),
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
   * Create business process request
   * @param {Object} payload
   * @return {Promise<any|{error: string}>}
   */
  async createBp(payload) {
    return this.request({
      payload,
      pubMessageType: 'createMetadata',
      subMessageType: 'createMetadataResult',
    });
  }

  /**
   * Get product request
   * @return {Promise<any|{error: string}>}
   */
  async getProduct() {
    return this.request({
      payload: {},
      pubMessageType: 'getProduct',
      subMessageType: 'getProductResult',
    });
  }

  /**
   * Request entity by id
   * @param {String} entity
   * @return {function(*): Promise<any|{error: string}>}
   */
  getById(entity) {
    return id => this.request({
      payload: { id },
      pubMessageType: `get${entity}`,
      subMessageType: `get${entity}Result`,
    });
  }

  /**
   * Request list on entities
   * @param {String} entity
   * @return {function(): Promise<any|{error: string}>}
   */
  list(entity) {
    return () => this.request({
      payload: {},
      pubMessageType: `list${entity}`,
      subMessageType: `list${entity}Result`,
    });
  }

  /**
   * Send artifacts
   * @param {Object} payload
   * @return {Promise<any|{error: string}>}
   */
  async sendArtifacts(payload) {
    return this.broadcast({
      payload,
      messageType: 'contractDeployment',
    });
  }

  /**
   * Get artifacts
   * @param {String} network
   * @return {Promise<any|{error: string}>}
   */
  async getArtifacts(network) {
    return this.request({
      payload: { network },
      pubMessageType: 'getArtifacts',
      subMessageType: 'getArtifactsResult',
    });
  }

  /**
   * Sent transaction request
   * @param {String} contractName
   * @param {String} methodName
   * @param {Array} parameters
   * @return {Promise<*>}
   */
  async sendTransaction(contractName, methodName, parameters) {
    const response = await this.request({
      payload: {
        contractName,
        methodName,
        parameters,
      },
      pubMessageType: 'contractTransactionRequest',
      subMessageType: 'contractTransactionResult',
    });

    return response.result;
  }

  /**
   * Call contract request
   * @param {String} contractName
   * @param {String} methodName
   * @param {Array} parameters
   * @return {Promise<*>}
   */
  async callContract(contractName, methodName, parameters) {
    const response = await this.request({
      payload: {
        contractName,
        methodName,
        parameters,
      },
      pubMessageType: 'contractCallRequest',
      subMessageType: 'contractCallResult',
    });

    return response.result;
  }

  /**
   * Broadcast message
   * @param {Object} payload
   * @param {String} messageType
   * @return {Promise<void>}
   */
  async broadcast({ payload, messageType }) {
    try {
      await this._amqp.createChannels();

      await this._amqp.publish({
        messageType,
        messageVersion: '1.*',
        content: {
          ...payload,
        },
      });

      await this._amqp.closeChannels();
    } catch (e) {
      this.errorHandler(e);
    }
  }

  /**
   * Handler for message with Ethereum event
   * @param {Function} handler
   * @return {Promise<void>}
   */
  async onEvent(handler) {
    try {
      await this._amqp.createChannels();

      this._amqp.consume({
        product: this._amqp.appName,
        messageType: 'decodedEvent',
        messageVersion: '1.*',
        handler,
      });
    } catch (e) {
      this.errorHandler(e);
    }
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
    return { error: e.message || e.error || e };
  }
}

module.exports = Gif;
