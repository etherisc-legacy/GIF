const amqp = require('amqplib');


/**
 * DIP Artifacts Storage microservice
 */
class DipArtifactsStorage {
  /**
   * Constructor
   * @param {string} amqpBroker
   * @param {object} s3
   */
  constructor({ amqpBroker, s3 }) {
    this._s3 = s3;
    this._amqpBroker = amqpBroker;
    this._amqp = null;
  }

  /**
   * Bootstrap and listen
   * @return {Promise<void>}
   */
  async listen() {
    const conn = await amqp.connect(this._amqpBroker);

    this._amqp = await conn.createChannel();

    await this._amqp.assertExchange('POLICY', 'topic', { durable: true });

    const deployed = await this._amqp.assertQueue('contract.deployed.v1', { exclusive: false });
    await this._amqp.bindQueue(deployed.queue, 'POLICY', 'contract.deployed.v1');
    await this._amqp.consume(deployed.queue, this.saveArtifact.bind(this), { noAck: true });

    const getArtifact = await this._amqp.assertQueue('contract.get_artifact.v1', { exclusive: false });
    await this._amqp.bindQueue(getArtifact.queue, 'POLICY', 'contract.get_artifact.v1');
    await this._amqp.consume(getArtifact.queue, this.sendArtifact.bind(this), { noAck: true });

    const getArtifactList = await this._amqp.assertQueue('contract.get_artifact_list.v1', { exclusive: false });
    await this._amqp.bindQueue(getArtifactList.queue, 'POLICY', 'contract.get_artifact_list.v1');
    await this._amqp.consume(getArtifactList.queue, this.sendArtifactList.bind(this), { noAck: true });
  }

  /**
   * Save artifact
   * @param {object} message
   * @return {void}
   */
  async saveArtifact(message) {
    try {
      const content = message.content.toString();
      const { network, version, artifact } = JSON.parse(content);
      const key = `${network}/${version}/${JSON.parse(artifact).contractName}.json`;
      await this._s3.putObject({
        Bucket: 'dip-artifacts-storage',
        Key: key,
        Body: artifact,
      }).promise();
      console.log(`Pushed object ${key}`);
    } catch (e) {
      console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }

  /**
   * Send artifact list
   * @param {object} message
   * @return {void}
   */
  async sendArtifactList(message) {
    try {
      const content = message.content.toString();
      const { network, version } = JSON.parse(content);
      const prefix = `${network}/${version}/`;
      const response = await this._s3.listObjects({
        Bucket: 'dip-artifacts-storage',
        Delimiter: '/',
        Prefix: prefix,
      }).promise();
      const list = response.Contents.map(o => o.Key.replace(prefix, '').replace('.json', ''));
      const answer = { network, version, list };
      await this._amqp.publish('POLICY', 'contract.artifact_list.v1', Buffer.from(JSON.stringify(answer)), {
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
   * Send artifact
   * @param {object} message
   * @return {void}
   */
  async sendArtifact(message) {
    try {
      const content = message.content.toString();
      const { network, version, contract } = JSON.parse(content);
      const key = `${network}/${version}/${contract}.json`;
      const response = await this._s3.getObject({
        Bucket: 'dip-artifacts-storage',
        Key: key,
      }).promise();
      const artifact = response.Body.toString();
      const answer = {
        network, version, contract, artifact,
      };
      await this._amqp.publish('POLICY', 'contract.artifact.v1', Buffer.from(JSON.stringify(answer)), {
        headers: {
          originatorName: process.env.npm_package_name,
          originatorVersion: process.env.npm_package_version,
        },
      });
    } catch (e) {
      console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }
}

module.exports = DipArtifactsStorage;
