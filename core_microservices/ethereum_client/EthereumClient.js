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
        product, network, networkId, version, artifact,
      } = content;

      const artifactObject = JSON.parse(artifact);
      const { address } = artifactObject.networks[networkId];

      const abi = JSON.stringify(artifactObject.abi);
      const { Contract } = this._models;

      const exists = await Contract.query().findOne({
        networkName: network,
        address: address.toLowerCase(),
      });

      if (!exists) {
        await Contract.query()
          .upsertGraph({
            product,
            contractName: artifactObject.contractName,
            networkName: network,
            version,
            address: address.toLowerCase(),
            abi,
          });

        this._log.info(`Artifact saved: ${product} ${artifactObject.contractName} (${address})`);
      }
    } catch (e) {
      this._log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
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
      product, contractName, methodName, key, parameters,
    } = content;
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

      result = await contractInterface.methods[methodName](...transformedParameters).send();
      this._log.info(`Completed ${methodName} transaction for ${contractName}@${product}`);
    } catch (error) {
      this._log.error(error);
      result = { error: error.message };
    }

    this._amqp.publish({
      messageType: 'contractTransactionResult',
      messageVersion: '1.*',
      content: {
        product,
        contractName,
        methodName,
        key,
        result,
      },
      correlationId: properties.correlationId,
    });
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
      product, contractName, methodName, key, parameters,
    } = content;
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

      result = await contractInterface.methods[methodName](...transformedParameters).call();
      this._log.info(`Completed ${methodName} call for ${contractName}@${product}`);
    } catch (error) {
      this._log.error(error);
      result = { error: error.message };
    }

    this._amqp.publish({
      messageType: 'contractCallResult',
      messageVersion: '1.*',
      content: {
        product,
        contractName,
        methodName,
        key,
        result,
      },
      correlationId: properties.correlationId,
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
    const transformedParameters = [];
    for (let index = 0; index < parameters.length; index += 1) {
      const paramFormat = methodDescription.inputs[index];
      if (/bytes/.test(paramFormat.type)) {
        const byteSize = parseInt(paramFormat.type.replace('bytes', ''), 10);
        const hexString = (parameters[index].match(/^0x/))
          ? parameters[index] : web3.utils.asciiToHex(parameters[index]);
        transformedParameters[index] = web3.utils.padRight(hexString, byteSize + 2).substr(0, byteSize + 2);
      } else {
        transformedParameters[index] = parameters[index];
      }
    }
    return transformedParameters;
  }
}

module.exports = EthereumClient;
