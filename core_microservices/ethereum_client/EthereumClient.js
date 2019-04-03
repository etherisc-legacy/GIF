const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const models = require('./models');

/**
 * Signer factory
 * @return {{}}
 */
const signer = () => new Web3(new HDWalletProvider(process.env.MNEMONIC, process.env.HTTP_PROVIDER, 0, 1, false));

/**
 * DIP Ethereum Client microservice
 */
class EthereumClient {
  /**
   * Constructor
   * @param {object} amqp
   * @param {object} db
   * @param {object} log
   */
  constructor({ amqp, db, log }) {
    this._amqp = amqp;
    this._models = models(db);
    this._log = log;
  }

  /**
   * Bootstap and listen
   * @return {Promise<void>}
   */
  async bootstrap() {
    await this._amqp.consume({
      messageType: 'contractDeployment',
      messageTypeVersion: '1.*',
      handler: this.saveArtifact.bind(this),
    });

    await this._amqp.consume({
      messageType: 'contractTransactionRequest',
      messageTypeVersion: '1.*',
      handler: this.onTransactionRequest.bind(this),
    });

    await this._amqp.consume({
      messageType: 'contractCallRequest',
      messageTypeVersion: '1.*',
      handler: this.onCallRequest.bind(this),
    });
  }

  /**
   * Save artifact
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async saveArtifact({ content, fields, properties }) {
    try {
      const {
        network, networkId, version, artifact,
      } = content;

      const { product } = properties.headers;

      if (!product) {
        throw new Error('Product not defined');
      }

      const artifactObject = JSON.parse(artifact);
      const { address } = artifactObject.networks[networkId];

      const abi = JSON.stringify(artifactObject.abi);
      const { Contract } = this._models;

      const contractLookupCriteria = {
        product,
        networkName: network,
        contractName: artifactObject.contractName,
        version,
      };
      const updateValues = {
        address: address.toLowerCase(),
        abi,
      };

      const exists = await Contract.query().findOne(contractLookupCriteria);

      if (!exists) {
        await Contract.query()
          .upsertGraph({ ...contractLookupCriteria, ...updateValues });
      } else {
        await Contract.query()
          .where(contractLookupCriteria)
          .update(updateValues);
      }

      this._log.info(`Artifact saved: ${product} ${artifactObject.contractName} (${address})`);
    } catch (error) {
      this._log.error(new Error(JSON.stringify({ message: error.message, stack: error.stack })));
    }
  }

  /**
   * Handle transaction request
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async onTransactionRequest({ content, fields, properties }) {
    const {
      contractName, methodName, key, parameters,
    } = content;

    const { product } = properties.headers;

    if (!product) {
      throw new Error('Product not defined');
    }

    const { Contract } = this._models;

    this._log.info(`Making ${methodName} transaction for ${contractName}@${product}`);

    let result;
    try {
      const contractData = await Contract.query().findOne({
        product,
        contractName,
        networkName: process.env.NETWORK_NAME,
      });

      const web3 = signer();
      // TODO: should gas and gasPrice be configurable per-request?
      const contractInterface = new (web3).eth.Contract(contractData.abi, contractData.address, {
        gasPrice: 10 * (10 ** 9),
        gas: 3000000,
        from: process.env.ACCOUNT,
      });

      const methodDescription = contractData.abi.find(method => method.name === methodName);

      const transformedParameters = this.transformParams(parameters, methodDescription, web3.utils);

      result = await new Promise((resolve, reject) => {
        contractInterface.methods[methodName](...transformedParameters).send()
          .on('confirmation', (confirmation, receipt) => resolve(receipt))
          .on('receipt', receipt => resolve(receipt))
          .on('error', error => reject(error))
          .catch((error) => {
            if (error.code === 'INVALID_ARGUMENT') {
              const types = error.value.types.map(type => `${type.type} ${type.name}`);
              reject(new Error(`Expected ${error.count.types} arguments (${types.join(', ')}), but ${error.count.values} values provided (${error.value.values.join(', ')})`));
            }

            reject(error);
          });
      });

      this._log.info(`Completed ${methodName} transaction for ${contractName}@${product}`);
    } catch (error) {
      this._log.error(error);
      result = { error: error.message };
    } finally {
      this._amqp.publish({
        product,
        messageType: 'contractTransactionResult',
        messageVersion: '1.*',
        content: {
          product,
          contractName,
          methodName,
          key,
          result,
          networkName: process.env.NETWORK_NAME,
        },
        correlationId: properties.correlationId,
        customHeaders: properties.headers,
      });
    }
  }

  /**
   * Handle call request
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async onCallRequest({ content, fields, properties }) {
    const {
      contractName, methodName, key, parameters,
    } = content;

    const { product } = properties.headers;

    if (!product) {
      throw new Error('Product not defined');
    }

    const { Contract } = this._models;

    this._log.info(`Making ${methodName} call for ${contractName}@${product}`);

    let result;
    try {
      const contractData = await Contract.query().findOne({
        product,
        contractName,
        networkName: process.env.NETWORK_NAME,
      });

      const web3 = signer();
      // TODO: should gas and gasPrice be configurable per-request?
      const contractInterface = new (web3).eth.Contract(contractData.abi, contractData.address, {
        from: process.env.ACCOUNT,
      });

      const methodDescription = contractData.abi.find(method => method.name === methodName);
      const transformedParameters = this.transformParams(parameters, methodDescription, web3.utils);

      const callResult = await contractInterface.methods[methodName](...transformedParameters).call();

      result = this.transformOutput(callResult, methodDescription.outputs, web3.utils);
      this._log.info(`Completed ${methodName} call for ${contractName}@${product}`);
    } catch (error) {
      this._log.error(error);

      if (error.code === 'INVALID_ARGUMENT') {
        const types = error.value.types.map(type => `${type.type} ${type.name}`);
        result = { error: `Expected ${error.count.types} arguments (${types.join(', ')}), but ${error.count.values} values provided (${error.value.values.join(', ')})` };
      } else {
        result = { error: error.message };
      }
    }

    this._amqp.publish({
      product,
      messageType: 'contractCallResult',
      messageVersion: '1.*',
      content: {
        product,
        contractName,
        methodName,
        key,
        result,
        networkName: process.env.NETWORK_NAME,
      },
      correlationId: properties.correlationId,
      customHeaders: properties.headers,
    });
  }

  /**
   * Handle call request
   * @param {[]} parameters
   * @param {{}} methodDescription
   * @param {{}} utils
   * @return {[]} transformedparameters
   */
  transformParams(parameters, methodDescription, utils) {
    const web3 = signer();
    const transformedParameters = [];
    for (let index = 0; index < parameters.length; index += 1) {
      const paramFormat = methodDescription.inputs[index];

      if (!paramFormat) {
        const types = methodDescription.inputs.map(type => `${type.type} ${type.name}`);
        throw new Error(`Unknown argument ${parameters[index]}, expected arguments: ${types.join(', ')}`);
      }

      if (/bytes/.test(paramFormat.type)) {
        const byteSize = parseInt(paramFormat.type.replace('bytes', ''), 10);
        const length = byteSize * 2 + 2;
        const hexString = (parameters[index].match(/^0x/))
          ? parameters[index] : web3.utils.utf8ToHex(parameters[index]);
        transformedParameters[index] = web3.utils.padRight(hexString, length).substr(0, length);
      } else {
        transformedParameters[index] = parameters[index];
      }
    }
    return transformedParameters;
  }

  /**
   * Transform contract call output
   * @param {*} data
   * @param {Object} abi
   * @param {Object} utils
   * @return {Object}
   */
  transformOutput(data, abi, utils) {
    const result = {};

    if (abi.length === 1) {
      const { name, type } = abi[0];
      result[name] = this.format(data, type, utils);
      return result;
    }

    for (let i = 0; i < abi.length; i += 1) {
      const { name, type } = abi[i];
      result[name] = this.format(data[name], type, utils);
    }

    return result;
  }

  /**
   * Format values
   * @param {*} value
   * @param {String} type
   * @param {Object} utils
   * @return {*}
   */
  format(value, type, utils) {
    if (/bytes/.test(type)) {
      // e.g. bytes32
      return utils.toUtf8(value);
    }

    if (type === 'address') {
      return value.toLowerCase();
    }

    if (/int[\d]+\[\]/.test(type)) {
      // e.g. uint256[], int64[]
      return value.map(el => el.toString());
    }

    if (/int/.test(type)) {
      // e.g. uint256, int256
      return value.toString();
    }

    return value;
  }
}

module.exports = EthereumClient;
