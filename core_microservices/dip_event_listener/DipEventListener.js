const { Pool } = require('pg');
const amqp = require('amqplib');
const Web3 = require('web3');
const { Readable } = require('stream');


/**
 * DIP Event Listener microservice
 */
class DipEventListener {
  /**
   * Constructor
   * @param {string} amqpBroker
   * @param {string} pgConnectionString
   * @param {string} rpcNode
   * @param {string} networkName
   */
  constructor(
    {
      amqpBroker, pgConnectionString, rpcNode, networkName,
    },
  ) {
    this._pool = new Pool({
      connectionString: pgConnectionString,
    });
    this._amqpBroker = amqpBroker;
    this._amqp = null;
    this._web3 = new Web3(rpcNode);
    this.networkName = networkName;
  }

  /**
   * Get past events
   * @param {buffer} buffer
   * @return {void}
   */
  async getPastEvents(buffer) {
    try {
      const addresses = JSON.parse(buffer.toString());
      /* eslint-disable-next-line no-restricted-syntax */
      for (const i of addresses) {
        const event = await this._pool.query('SELECT "blockNumber" + 1 AS "nextBlock" FROM dip_event_listener_events WHERE "networkName" = $1 AND address IN ($2) ORDER BY "blockNumber" DESC LIMIT 1', [this.networkName, i.address]);
        this._web3.eth.getPastLogs({ fromBlock: event.nextBlock, address: i.address })
          .then(events => events.forEach(this.handleEvent.bind(this)));
      }
    } catch (e) {
      console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }

  /**
   * Watch events realtime
   * @return {void}
   */
  async watchEventsRealtime() {
    try {
      this.subscription = this._web3.eth.subscribe('logs', { fromBlock: this.fromBlock })
        .on('data', async (event) => {
          this.fromBlock = event.blockNumber;
          const exists = await this._pool.query('SELECT EXISTS (SELECT 1 FROM dip_event_listener_contracts WHERE "networkName" = $1 AND address = $2)', [this.networkName, event.address]);
          if (exists) this.handleEvent(event);
        })
        .on('error', async (e) => {
          console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
          await this.subscription.unsubscribe();
          this.watchEventsRealtime();
        });
    } catch (e) {
      console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }

  /**
   * Handle event
   * @param {object} event
   * @return {void}
   */
  async handleEvent(event) {
    try {
      const result = await this._pool.query('SELECT abi, version FROM dip_event_listener_contracts WHERE "networkName" = $1 AND address = lower($2)', [this.networkName, event.address]);
      if (!result.rows[0]) return;
      const abi = JSON.parse(result.rows[0].abi)
        .filter(i => i.type === 'event')
        .map(i => Object.assign(i, { signature: this._web3.eth.abi.encodeEventSignature(i) }))
        .filter(i => i.signature === event.topics[0]);
      const decodedEvent = this._web3.eth.abi.decodeLog(abi[0].inputs, event.data, event.topics.slice(1));
      const block = await this._web3.eth.getBlock(event.blockNumber);
      const { rows } = await this._pool.query('INSERT INTO dip_event_listener_events (address, topics, data, "blockNumber", "timeStamp", "logIndex", "transactionHash", "transactionIndex", "eventName", "eventArgs", "networkName", version) VALUES ($1, $2, $3, $4, to_timestamp($5), $6, $7, $8, $9, $10, $11, $12) ON CONFLICT ("networkName", "transactionHash", "logIndex") DO NOTHING RETURNING *', [
        event.address, event.topics, event.data, event.blockNumber, block.timestamp, event.logIndex,
        event.transactionHash, event.transactionIndex, abi[0].name, decodedEvent, this.networkName,
        result.rows[0].version,
      ]);
      if (!rows[0]) return;
      await this._amqp.publish('POLICY', 'event_listener.decoded_event.v1', Buffer.from(JSON.stringify(rows[0])), {
        headers: {
          originatorName: process.env.npm_package_name,
          originatorVersion: process.env.npm_package_version,
        },
      });
    } catch (e) {
      console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }

  /**
   * Send existing events
   * @return {void}
   */
  async sendExistingEvents() {
    try {
      // filter by network, version, address, fromBlock and any other fields including eventArgs
      const event = await this._pool.query('SELECT * FROM dip_event_listener_events', []);
      await this._amqp.publish('POLICY', 'event_listener.decoded_event.v1', Buffer.from(JSON.stringify(event)), {
        headers: {
          originatorName: process.env.npm_package_name,
          originatorVersion: process.env.npm_package_version,
        },
      });
    } catch (e) {
      console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }

  /**
   * Request artifacts
   * @param {object} message
   * @return {void}
   */
  async requestArtifacts(message) {
    try {
      const { version, list } = JSON.parse(message.content.toString());
      list.forEach((contract) => {
        this._amqp.publish('POLICY', 'contract.get_artifact.v1', Buffer.from(
          JSON.stringify({ network: this.networkName, version, contract }),
        ), {
          headers: {
            originatorName: process.env.npm_package_name,
            originatorVersion: process.env.npm_package_version,
          },
        });
      });
    } catch (e) {
      console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }

  /**
   * Save artifact
   * @param {object} message
   * @return {void}
   */
  async saveArtifact(message) {
    try {
      const { version, artifact } = JSON.parse(message.content.toString());
      const artifactObject = JSON.parse(artifact);
      const networkId = Object.keys(artifactObject.networks)[0];
      const { address } = artifactObject.networks[networkId];
      const abi = JSON.stringify(artifactObject.abi);
      await this._pool.query('INSERT INTO dip_event_listener_contracts ("networkName", version, address, abi) VALUES ($1, $2, $3, $4) ON CONFLICT ("networkName", address) DO UPDATE SET version = excluded.version, abi = excluded.abi', [this.networkName, version, address, abi]);
    } catch (e) {
      console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }

  /**
   * Bootstrap and listen
   * @return {void}
   */
  async listen() {
    const conn = await amqp.connect(this._amqpBroker);
    this._amqp = await conn.createChannel();
    await this._amqp.assertExchange('POLICY', 'topic', { durable: true });

    this.fromBlock = await this._web3.eth.getBlockNumber();

    const contractsStream = new Readable({
      /**
       * Reading stream
       */
      read() {
        this._pool.query('SELECT address FROM dip_event_listener_contracts WHERE "networkName" = $1 ORDER BY id LIMIT 100 OFFSET $2', [this.networkName, this.offset])
          .then((contracts) => {
            if (contracts.rows.length === 0) return this.push(null);
            this.push(JSON.stringify(contracts.rows));
            this.offset += 100;
            return true;
          });
      },
    });
    contractsStream.offset = 0;
    contractsStream._pool = this._pool;
    contractsStream.networkName = this.networkName;
    contractsStream.on('end', this.watchEventsRealtime.bind(this));
    contractsStream.on('data', this.getPastEvents.bind(this));

    const existingEvents = await this._amqp.assertQueue('event_listener.get_existing_events.v1', { exclusive: false });
    await this._amqp.bindQueue(existingEvents.queue, 'POLICY', 'event_listener.get_existing_events.v1');
    await this._amqp.consume(existingEvents.queue, this.sendExistingEvents.bind(this), { noAck: true });

    const getArtifactList = await this._amqp.assertQueue('contract.get_artifact_list.v1', { exclusive: false });
    this._amqp.publish('POLICY', getArtifactList.queue, Buffer.from(JSON.stringify({ network: this.networkName })), {
      headers: {
        originatorName: process.env.npm_package_name,
        originatorVersion: process.env.npm_package_version,
      },
    });
    const artifactList = await this._amqp.assertQueue('contract.artifact_list.v1', { exclusive: false });
    await this._amqp.bindQueue(artifactList.queue, 'POLICY', 'contract.artifact_list.v1');
    await this._amqp.consume(artifactList.queue, this.requestArtifacts.bind(this), { noAck: true });

    const artifact = await this._amqp.assertQueue('contract.deployed.v1', { exclusive: false });
    await this._amqp.bindQueue(artifact.queue, 'POLICY', 'contract.artifact.v1');
    await this._amqp.consume(artifact.queue, this.saveArtifact.bind(this), { noAck: true });

    const deployed = await this._amqp.assertQueue('contract.deployed.v1', { exclusive: false });
    await this._amqp.bindQueue(deployed.queue, 'POLICY', 'contract.deployed.v1');
    await this._amqp.consume(deployed.queue, this.saveArtifact.bind(this), { noAck: true });
  }
}

module.exports = DipEventListener;
