/**
 * DIP Artifacts Storage microservice
 */
class DipArtifactsStorage {
  /**
   * Constructor
   * @param {object} amqp
   * @param {object} s3
   */
  constructor({ amqp, config }) {
    this.amqp = amqp;
    this.s3 = config.s3;
  }

  /**
   * Bootstrap and listen
   * @return {Promise<void>}
   */
  async bootstrap() {
    this.amqp.consume({
      messageType: 'contractDeployment',
      messageVersion: '1.*',
      handler: this.saveArtifact.bind(this),
    });

    this.amqp.consume({
      messageType: 'artifactRequest',
      messageVersion: '1.*',
      handler: this.sendArtifact.bind(this),
    });

    this.amqp.consume({
      messageType: 'artifactListRequest',
      messageVersion: '1.*',
      handler: this.sendArtifactList.bind(this),
    });
  }

  /**
   * Save artifact
   * @param {object} message
   * @return {void}
   */
  async saveArtifact({ content, fields, properties }) {
    try {
      const { network, version, artifact } = content;
      const key = `${network}/${version}/${JSON.parse(artifact).contractName}.json`;
      await this.s3.putObject({
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
   * @param {object} network
   * @return {string}
   */
  async getLastVersion(network) {
    const prefix = `${network}/`;
    const response = await this.s3.listObjects({
      Bucket: 'dip-artifacts-storage',
      // Delimiter: '/',
      Prefix: prefix,
    }).promise();
    return response.Contents.map(o => o.Key.replace(prefix, '').replace(/(.+)\/.+/, '$1')).sort().slice(-1)[0];
  }

  /**
   * Send artifact list
   * @param {object} message
   * @return {void}
   */
  async sendArtifactList({ content, fields, properties }) {
    try {
      let { version } = content;
      if (!version) version = await this.getLastVersion(content.network);
      const prefix = `${content.network}/${version}/`;
      const response = await this.s3.listObjects({
        Bucket: 'dip-artifacts-storage',
        Delimiter: '/',
        Prefix: prefix,
      }).promise();
      const list = response.Contents.map(o => o.Key.replace(prefix, '').replace('.json', ''));

      const answer = { network: content.network, version, list };

      await this.amqp.publish({
        messageType: 'artifactList',
        messageVersion: '1.*',
        content: answer,
        correlationId: properties.correlationId,
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
  async sendArtifact({ content, fields, properties }) {
    try {
      const { network, version, contract } = content;
      const key = `${network}/${version}/${contract}.json`; // add to prefix app name from message metadata
      const response = await this.s3.getObject({
        Bucket: 'dip-artifacts-storage',
        Key: key,
      }).promise();
      const artifact = response.Body.toString();
      const answer = {
        network, version, contract, artifact,
      };
      await this.amqp.publish({
        messageType: 'artifact',
        messageVersion: '1.*',
        content: answer,
        correlationId: properties.correlationId,
      });
    } catch (e) {
      console.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }
}

module.exports = DipArtifactsStorage;
