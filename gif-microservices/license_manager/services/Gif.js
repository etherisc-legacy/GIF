/* eslint-disable no-console */

const EventEmitter = require('events');
const uuid = require('uuid/v1');
const _ = require('lodash');


const REQUEST_TIMEOUT = 5000;

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
   *
   * @param{{}} amqpTrusted
   * @param{{}} log
   */
  constructor({ amqpTrusted, log }) {
    super();
    this._amqp = amqpTrusted;
    this._log = log;
    this._consumers = {};
  }

  /**
   *
   * @param {String} product
   * @param {object} payload
   * @returns {Promise<any|{error: string}|*>}
   */
  async getEvents(product, payload) {
    return this.request({
      product,
      payload,
      pubMessageType: 'existingEventsRequest',
      subMessageType: 'decodedEvent',
    });
  }

  /* Customers section */

  /**
   * Greate customer request
   * @param {String} product
   * @param {Object} payload
   * @return {Promise<any|{error: string}>}
   */
  async createCustomer(product, payload) {
    if (!payload.firstname || !payload.lastname || !payload.email) {
      return this.wrongArgument('gif.customer.create');
    }

    return this.request({
      product,
      payload,
      pubMessageType: 'createCustomer',
      subMessageType: 'createCustomerResult',
    });
  }

  /**
   * Create business process request
   * @param {String} product
   * @param {Object} payload
   * @return {Promise<any|{error: string}>}
   */
  async createBp(product, payload) {
    return this.request({
      product,
      payload,
      pubMessageType: 'createMetadata',
      subMessageType: 'createMetadataResult',
    });
  }

  /**
   * Get product request
   * @param {String} product
   * @return {Promise<any|{error: string}>}
   */
  async getProduct(product) {
    return this.request({
      product,
      payload: {},
      pubMessageType: 'getProduct',
      subMessageType: 'getProductResult',
    });
  }

  /**
   * Request entity by id
   * @param {String} product
   * @param {String} entity
   * @param {String} identifier
   * @return {function(*): Promise<any|{error: string}>}
   */
  getByIdentifier(product, entity, identifier = 'id') {
    if (!entity && !entities[entity]) {
      throw new Error('Unknown entity');
    }

    return (id) => {
      if (!id) {
        return this.wrongArgument(`gif.${entity}.getBy${_.upperFirst(identifier)}`);
      }

      return this.request({
        product,
        payload: { id, identifier },
        pubMessageType: `get${entities[entity].singular}`,
        subMessageType: `get${entities[entity].singular}Result`,
      });
    };
  }

  /**
   * Request list on entities
   * @param {String} product
   * @param {String} entity
   * @return {function(): Promise<any|{error: string}>}
   */
  list(product, entity) {
    if (!entity && !entities[entity]) {
      throw new Error('Unknown entity');
    }

    return () => this.request({
      product,
      payload: {},
      pubMessageType: `list${entities[entity].plural}`,
      subMessageType: `list${entities[entity].plural}Result`,
    });
  }

  /**
   * Send artifact
   * @param {String} product
   * @param {Object} payload
   * @return {Promise<any|{error: string}>}
   */
  async sendArtifact(product, payload = {}) {
    if (!payload.network && !payload.networkId && !payload.artifact && !payload.version) {
      return this.wrongArgument('gif.artifact.send');
    }
    return this.request({
      product, // TODO: this is just a quick hack, put it in users profile
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
  async getArtifact({ product, networkName, contractName }) {
    if (!contractName) {
      return this.wrongArgument('gif.artifact.get');
    }
    return this.request({
      product: 'platform', // TODO: put this in user profile
      payload: { product, networkName, contractName },
      pubMessageType: 'getArtifact',
      subMessageType: 'getArtifactResult',
    });
  }

  /**
   * Sent transaction request
   * @param {String} product
   * @param {String} contractName
   * @param {String} methodName
   * @param {Array} parameters
   * @return {Promise<*>}
   */
  async sendTransaction(product, contractName, methodName, parameters) {
    if (!contractName || !methodName || !parameters) {
      return this.wrongArgument('gif.contract.send');
    }
    const response = await this.request({
      product, // TODO: see above
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
   * @param {String} product
   * @param {String} contractName
   * @param {String} methodName
   * @param {Array} parameters
   * @return {Promise<*>}
   */
  async callContract({
    product, contractName, methodName, parameters,
  }) {
    if (!contractName || !methodName || !parameters) {
      return this.wrongArgument('gif.contract.call');
    }

    const response = await this.request({
      product, // TODO: see above
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
   *
   * @param {Object} params
   * @param {String} product
   * @param {Object} params.payload
   * @param {String} params.pubMessageType
   * @param {String} params.subMessageType
   * @returns {Promise<unknown>}
   * @private
   */
  async request({
    product, payload, pubMessageType, subMessageType,
  }) {
    if (!this._consumers[subMessageType]) {
      await this._amqp.consume({
        product,
        messageType: subMessageType,
        messageTypeVersion: '1.*',
        handler: ({ content, properties }) => {
          const { requestId } = properties.headers;

          if (!requestId) {
            this.errorHandler('RequestId not provided');
          }

          this.emit(requestId, content);
        },
      });

      this._consumers[subMessageType] = true;
    }

    const requestId = uuid();

    return new Promise((resolve, reject) => {
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
