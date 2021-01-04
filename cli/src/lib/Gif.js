/* eslint-disable no-console */

const EventEmitter = require('events');
const uuid = require('uuid/v1');
const _ = require('lodash');
const chalk = require('chalk');
const columnify = require('columnify');
const errorMessages = require('./errorMessages');
const docs = require('./docs');


const REQUEST_TIMEOUT = 100000;

/**
 * Call function on timeout
 * @param {Function} cb
 */
const scheduleTimeout = (cb) => {
  setTimeout(() => cb('Timeout'), REQUEST_TIMEOUT);
};

const entities = {
  bp: { singular: 'Metadata', plural: 'Metadata' },
  customer: { singular: 'Customer', plural: 'Customers' },
  application: { singular: 'Application', plural: 'Applications' },
  policy: { singular: 'Policy', plural: 'Policies' },
  claim: { singular: 'Claim', plural: 'Claims' },
  payout: { singular: 'Payout', plural: 'Payouts' },
};

/**
 * GIF client
 */
class Gif extends EventEmitter {
  /**
   * Constructor
   * @param {Amqp} amqp
   * @param {Object} info
   * @param {Object} eth
   * @param {Function} errorHandler
   */
  constructor(amqp, info, eth, errorHandler) {
    super();

    this._amqp = amqp;
    this._info = info;
    this._eth = eth;
    this._error = errorHandler;
    this._connected = true;
    this._consumers = {};
  }

  /**
   * Check amqp connection
   * @return {boolean}
   */
  get connected() {
    return this._connected;
  }

  /**
   * Connect to amqp
   * @return {Promise<void>}
   */
  async connect() {
    try {
      await this._amqp.createConnections();
      this._connected = true;
    } catch (e) {
      console.log(e);
      this._error(errorMessages.failedToConnect(this._info.product));
    }
  }

  /**
   *
   * @return {Promise<void>}
   */
  async usePersistantChannels() {
    try {
      await this._amqp.createChannels();
      this._consumers = {};
      this._persistantChannels = true;
    } catch (e) {
      this._error(errorMessages.createChannelsFailed(this._info.product));
    }
  }

  /**
   * Shutdown
   */
  async shutdown() {
    console.log('Shutdown connection...');
    try {
      if (this._persistantChannels) {
        await this._amqp.closeChannels();
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      await this._amqp.closeConnections();
      this._connected = false;
      console.log('Bye...');
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * CLI
   * @return {Object}
   */
  get commands() {
    return {
      info: this.info.bind(this),
      help: this.help.bind(this),
      events: {
        get: this.getEvents.bind(this),
      },
      artifact: {
        get: this.getArtifact.bind(this),
        send: this.sendArtifact.bind(this),
      },
      contract: {
        send: this.sendTransaction.bind(this),
        call: this.callContract.bind(this),
      },
      customer: {
        create: this.createCustomer.bind(this),
        getById: this.getByIdentifier('customer').bind(this),
        list: this.list('customer').bind(this),
      },
      bp: {
        create: this.createBp.bind(this),
        getByKey: this.getByIdentifier('bp', 'key').bind(this),
        getById: this.getByIdentifier('bp').bind(this),
        list: this.list('bp').bind(this),
      },
      application: {
        getById: this.getByIdentifier('application').bind(this),
        list: this.list('application').bind(this),
      },
      policy: {
        getById: this.getByIdentifier('policy').bind(this),
        list: this.list('policy').bind(this),
      },
      claim: {
        getById: this.getByIdentifier('claim').bind(this),
        list: this.list('claim').bind(this),
      },
      payout: {
        getById: this.getByIdentifier('payout').bind(this),
        list: this.list('payout').bind(this),
      },
      product: {
        get: this.getProduct.bind(this),
      },
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

  /**
   * Get information about commad
   * @param {String} cmd
   * @return {void}
   */
  help(cmd) {
    if (!cmd) {
      const commands = _.map(_.keys(docs), el => [chalk.blue(el), docs[el].annotation]);
      console.log(columnify(commands, { showHeaders: false }));
      return;
    }

    if (!docs[cmd]) {
      console.error(`No documentation for ${cmd}`);
      return;
    }

    console.log('     ', chalk.blue(docs[cmd].annotation));
    if (docs[cmd].details) {
      console.log(docs[cmd].details);
    }
  }

  /* Events section */

  /**
   *
   * @param {object} payload
   * @returns {Promise<any|{error: string}|*>}
   */
  async getEvents(payload) {
    return this.request({
      payload,
      pubMessageType: 'existingEventsRequest',
      subMessageType: 'decodedEvent',
    });
  }

  /* Customers section */

  /**
   * Greate customer request
   * @param {Object} payload
   * @return {Promise<any|{error: string}>}
   */
  async createCustomer(payload) {
    if (!payload.firstname || !payload.lastname || !payload.email) {
      return this.wrongArgument('gif.customer.create');
    }

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
   * @param {String} identifier
   * @return {function(*): Promise<any|{error: string}>}
   */
  getByIdentifier(entity, identifier = 'id') {
    if (!entity && !entities[entity]) {
      throw new Error('Unknown entity');
    }

    return (id) => {
      if (!id) {
        return this.wrongArgument(`gif.${entity}.getBy${_.upperFirst(identifier)}`);
      }

      return this.request({
        payload: { id, identifier },
        pubMessageType: `get${entities[entity].singular}`,
        subMessageType: `get${entities[entity].singular}Result`,
      });
    };
  }

  /**
   * Request list on entities
   * @param {String} entity
   * @return {function(): Promise<any|{error: string}>}
   */
  list(entity) {
    if (!entity && !entities[entity]) {
      throw new Error('Unknown entity');
    }

    return () => this.request({
      payload: {},
      pubMessageType: `list${entities[entity].plural}`,
      subMessageType: `list${entities[entity].plural}Result`,
    });
  }

  /**
   * Send artifact
   * @param {Object} payload
   * @return {Promise<any|{error: string}>}
   */
  async sendArtifact(payload = {}) {
    if (!payload.network && !payload.networkId && !payload.artifact && !payload.version) {
      return this.wrongArgument('gif.artifact.send');
    }
    return this.request({
      payload,
      pubMessageType: 'contractDeployment',
      subMessageType: 'contractDeploymentResult',
    });
  }

  /**
   * Get artifacts
   * @param {String} product
   * @param {String} networkName
   * @param {String} contractName
   * @return {Promise<any|{error: string}>}
   */
  async getArtifact(product, networkName, contractName) {
    if (!contractName) {
      return this.wrongArgument('gif.artifact.get');
    }
    return this.request({
      payload: { product, networkName, contractName },
      pubMessageType: 'getArtifact',
      subMessageType: 'getArtifactResult',
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
    if (!contractName && !methodName && !parameters) {
      return this.wrongArgument('gif.contract.send');
    }
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
    if (!contractName && !methodName && !parameters) {
      return this.wrongArgument('gif.contract.call');
    }

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
   *
   * @param {Object} params
   * @param {Object} params.payload
   * @param {String} params.pubMessageType
   * @param {String} params.subMessageType
   * @returns {Promise<any|{error: string}|*>}
   */
  async request({ payload, pubMessageType, subMessageType }) {
    try {
      let result;

      if (this._persistantChannels) {
        result = await this._requestWithPersistantChannels({ payload, pubMessageType, subMessageType });
      } else {
        result = await this._request({ payload, pubMessageType, subMessageType });
      }

      return result;
    } catch (e) {
      this._error(e);
      // const err = this.errorHandler(e);
      return e;
    }
  }

  /**
   *
   * @param {Object} params
   * @param {Object} params.payload
   * @param {String} params.pubMessageType
   * @param {String} params.subMessageType
   * @returns {Promise<unknown>}
   * @private
   */
  async _requestWithPersistantChannels({ payload, pubMessageType, subMessageType }) {
    if (!this._consumers[subMessageType]) {
      await this._amqp.consume({
        product: this._product,
        messageType: subMessageType,
        messageVersion: '1.*',
        handler: ({ content, properties }) => {
          const { requestId } = properties.headers;

          if (!requestId) {
            this.errorHandler('RequestId not provided');
          }

          this.emit(requestId, content);
        },
      });

      this._consumers.subMessageType = true;
    }

    const requestId = uuid();

    const result = await new Promise((resolve, reject) => {
      const timeout = scheduleTimeout(reject);
      /* eslint-disable-next-line require-jsdoc */
      const handler = (content) => {
        this.removeListener(requestId, handler);
        clearTimeout(timeout);
        resolve(content);
      };

      this.on(requestId, handler);

      this._amqp.publish({
        messageType: pubMessageType,
        messageVersion: '1.*',
        content: {
          ...payload,
        },
        customHeaders: {
          requestId,
        },
      });
    });

    return result;
  }

  /**
   * Request
   * @param {Object} params
   * @param {Object} params.payload
   * @param {String} params.pubMessageType
   * @param {String} params.subMessageType
   * @return {Promise<any | {error: string}>}
   */
  async _request({ payload, pubMessageType, subMessageType }) {
    await this._amqp.createChannels();

    const requestId = uuid();

    const result = await new Promise((resolve, reject) => {
      this._amqp.consume({
        product: this._amqp.appName,
        messageType: subMessageType,
        messageVersion: '1.*',
        handler: ({ content, properties }) => {
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
  }

  /**
   * Handle error
   * @param {Error} e
   * @return {{error: String}}
   */
  errorHandler(e) {
    return { error: e.message || e.error || e };
  }

  /**
   * Wrong argument error handler
   * @param {String} cmd
   * @return {{error: String}}
   */
  wrongArgument(cmd) {
    this.cli.help(cmd);
    return this.errorHandler(new Error('Wrong arguments'));
  }
}

module.exports = Gif;
