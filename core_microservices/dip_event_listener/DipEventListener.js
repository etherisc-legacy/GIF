const Web3 = require('web3');
const models = require('./models');

/**
 * DIP Event Listener microservice
 */
class DipEventListener {
  /**
   * Constructor
   * @param {object} amqp
   * @param {object} db
   * @param {object} log
   * @param {object} http
   * @param {object} config
   */
  constructor(
    {
      amqp, db, log, http, config,
    },
  ) {
    this._amqp = amqp;
    this._db = db;
    this._models = models(db);
    this._log = log;
    this._http = http;
    this._web3 = new Web3(config.rpcNode);
    this._networkName = config.networkName;
  }

  /**
   * Bootstrap and listen
   * @return {void}
   */
  async bootstrap() {
    try {
      this.fromBlock = await this._web3.eth.getBlockNumber();

      await this.checkPastEvents();

      this.watchEventsRealtime();

      await this._amqp.consume({
        messageType: 'existingEventsRequest',
        messageTypeVersion: '1.*',
        handler: this.sendExistingEvents.bind(this),
      });

      await this._amqp.consume({
        messageType: 'artifact',
        messageTypeVersion: '1.*',
        handler: this.saveArtifact.bind(this),
      });

      await this._amqp.consume({
        messageType: 'contractDeployment',
        messageTypeVersion: '1.*',
        handler: this.saveArtifact.bind(this),
      });
    } catch (e) {
      const error = new Error(JSON.stringify({ message: e.message, stack: e.stack }));
      error.exit = true;
      this._log.error(error);
      throw error;
    }
  }

  /**
   * Check past events
   */
  async checkPastEvents() {
    try {
      const { Contract } = this._models;
      let offset = 0;
      let addresses = [];

      do {
        addresses = await Contract.query()
          .select('address')
          .where('networkName', this._networkName)
          .limit(1000)
          .offset(offset);

        if (addresses.length === 0) {
          return;
        }

        offset += 1000;

        await this.getPastEvents(addresses);
      } while (addresses.length > 0);
    } catch (e) {
      this._log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }

  /**
   * Get past events
   * @param {[]} addresses
   * @return {void}
   */
  async getPastEvents(addresses) {
    try {
      const { Event } = this._models;

      for (let i = 0, l = addresses.length; i < l; i += 1) {
        const { address } = addresses[i];

        const [lastevent] = await Event.query()
          .select('blockNumber')
          .where({ networkName: this._networkName, address: address.toLowerCase() })
          .orderBy('blockNumber', 'DESC')
          .limit(1);

        const events = await this._web3.eth.getPastLogs({
          fromBlock: lastevent && lastevent.blockNumber ? lastevent.blockNumber + 1 : 0,
          address,
        });

        for (let j = 0, k = events.length; j < k; j += 1) {
          await this.handleEvent(events[j]);
        }
      }
    } catch (e) {
      this._log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }

  /**
   * Handle event
   * @param {object} event
   * @return {void}
   */
  async onData(event) {
    try {
      this.fromBlock = event.blockNumber;
      const { Contract } = this._models;
      const contracts = await Contract.query().where({
        address: event.address.toLowerCase(),
        networkName: this._networkName,
      });
      if (contracts.length > 0) {
        this.handleEvent(event);
      }
    } catch (e) {
      this._log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }

  /**
   * Handle error
   * @param {error} e
   * @return {void}
   */
  onError(e) {
    this._log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    this.reconnect();
  }

  /**
   * Watch events realtime
   * @return {void}
   */
  watchEventsRealtime() {
    try {
      this._web3.eth.subscribe('logs', { fromBlock: this.fromBlock }, (e) => {
        if (!e) {
          return;
        }
        this._log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
        this.reconnect();
      })
        .on('data', this.onData.bind(this))
        .on('error', this.onError.bind(this));
    } catch (e) {
      this._log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
      this.reconnect();
    }
  }

  /**
   * Try to reconnect every 10 seconds
   */
  reconnect() {
    setTimeout(async () => {
      await this.checkPastEvents();
      this.watchEventsRealtime();
    }, 1000 * 10 /* 10 sec */);
  }

  /**
   * Handle event
   * @param {object} event
   * @return {void}
   */
  async handleEvent(event) {
    try {
      const { Contract, Event } = this._models;
      const contract = await Contract.query().where({
        networkName: this._networkName,
        address: event.address.toLowerCase(),
      }).first();
      if (!contract) {
        return;
      }
      const abi = contract.abi
        .filter(i => i.type === 'event')
        .map(i => Object.assign(i, { signature: this._web3.eth.abi.encodeEventSignature(i) }))
        .filter(i => i.signature === event.topics[0]);
      const decodedEvent = this._web3.eth.abi.decodeLog(abi[0].inputs, event.data, event.topics.slice(1));
      const block = await this._web3.eth.getBlock(event.blockNumber);
      await Event.query().upsertGraph({
        networkName: this._networkName,
        transactionHash: event.transactionHash,
        logIndex: event.logIndex,
        address: event.address.toLowerCase(),
        topics: JSON.stringify(event.topics),
        data: event.data,
        blockNumber: event.blockNumber,
        timeStamp: Event.raw('to_timestamp(?)', block.timestamp),
        transactionIndex: event.transactionIndex,
        eventName: abi[0].name,
        eventArgs: decodedEvent,
        version: contract.version,
        product: contract.product,
      });
      const eventModel = await Event.query().where({
        networkName: this._networkName,
        transactionHash: event.transactionHash,
        logIndex: event.logIndex,
      }).first();
      if (!eventModel) {
        return;
      }
      await this._amqp.publish({
        messageType: 'decodedEvent',
        messageTypeVersion: '1.*',
        content: eventModel,
      });
    } catch (e) {
      this._log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }

  /**
   * Send existing events
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async sendExistingEvents({ content, fields, properties }) {
    try {
      // const event = await this.db.raw(`SELECT * FROM ${schema}.events`, []);
      const { Event } = this._models;

      // todo: filter by network, version, address, fromBlock and any other fields including eventArgs
      const events = await Event.query().select();

      await this._amqp.publish({
        messageType: 'decodedEvent',
        messageTypeVersion: '1.*',
        content: events,
        correlationId: properties.correlationId,
      });
    } catch (e) {
      this._log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }

  /**
   * Request artifacts
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.fields
   * @param {{}} params.properties
   * @return {void}
   */
  async requestArtifacts({ content, fields, properties }) {
    try {
      const { version, list } = content;
      list.forEach((contract) => {
        this._amqp.publish({
          messageType: 'artifactRequest',
          messageTypeVersion: '1.*',
          content: { network: contract.networkName, version, contract },
          correlationId: properties.correlationId,
        });
      });
    } catch (e) {
      this._log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
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
        product, network, version, artifact,
      } = content;
      const artifactObject = JSON.parse(artifact);
      const networkId = Object.keys(artifactObject.networks)[0];
      const { address } = artifactObject.networks[networkId];
      const abi = JSON.stringify(artifactObject.abi);
      const { Contract } = this._models;

      await Contract.query()
        .upsertGraph({
          product,
          networkName: network,
          version,
          address: address.toLowerCase(),
          abi,
        });
    } catch (e) {
      this._log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }
}

module.exports = DipEventListener;
