const { schema } = require('./knexfile');


/**
 * DIP Artifacts Storage microservice
 */
class DipArtifactsStorage {
  /**
   * Constructor
   * @param {object} amqp
   * @param {object} config
   * @param {object} log
   * @param {object} s3
   * @param {object} db
   */
  constructor({
    amqp, config, log, s3, db,
  }) {
    this.amqp = amqp;
    this.config = config;
    this.log = log;
    this.s3 = s3.client;
    this.db = db;
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
  }

  /**
   * Save artifact
   * @param {object} message
   * @return {void}
   */
  async saveArtifact({ content, fields, properties }) {
    try {
      const {
        product, network, version, artifact,
      } = content;
      const key = `${product}/${network}/${version}/${JSON.parse(artifact).contractName}.json`;
      await this.s3.putObject({
        Bucket: this.config.bucket,
        Key: key,
        Body: artifact,
      }).promise();

      const parsedArtifact = JSON.parse(artifact);
      const { address } = parsedArtifact.networks[Object.keys(parsedArtifact.networks)[0]];
      await this.db.raw(`INSERT INTO ${schema}.artifacts (product, "networkName", version, address, abi) VALUES (?, ?, ?, ?, ?)`, [
        product, network, version, address, JSON.stringify(parsedArtifact.abi),
      ]);

      this.log.info(`Pushed object ${key}`);
    } catch (e) {
      this.log.error(new Error(JSON.stringify({ message: e.message, stack: e.stack })));
    }
  }
}

module.exports = DipArtifactsStorage;
