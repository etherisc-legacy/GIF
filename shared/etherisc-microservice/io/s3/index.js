const AWS = require('aws-sdk');

/**
 * Database
 */
class S3 {
  /**
   * Constructor
   * @param {options} options
   */
  constructor(options) {
    this.options = options;

    this.client = null;
  }

  /**
   * Start module
   * @param {string} bucket
   * @return {Promise<void>}
   */
  async bootstrap(bucket) {
    this.bucket = bucket;
    this.client = new AWS.S3(this.options);
    if (!this.bucket) return;
    await this.client.createBucket({ Bucket: this.bucket }).promise()
      .catch((e) => {
        const error = new Error(JSON.stringify({ message: e.message, stack: e.stack }));
        if (e.code !== 'BucketAlreadyOwnedByYou') {
          error.exit = true;
          throw (error);
        }
      });
  }

  /**
   * Send artifact list
   * @param {string} product
   * @param {string} network
   * @return {string}
   */
  async getLastVersion(product, network) {
    const prefix = `${product}/${network}/`;
    const response = await this.client.listObjects({
      Bucket: this.bucket,
      Prefix: prefix,
    }).promise();
    return response.Contents
      .map(o => o.Key.replace(prefix, '').replace(/(.+)\/.+/, '$1'))
      .sort()
      .slice(-1)[0];
  }

  /**
   * Getting artifacts
   * @param {string} product
   * @param {string} network
   * @param {string} version
   * @return {array<buffer>}
   */
  async getArtifacts(product, network, version) {
    const prefix = `${product}/${network}/${version || await this.getLastVersion(product, network)}/`;
    const list = await this.client.listObjects({
      Bucket: this.bucket,
      Delimiter: '/',
      Prefix: prefix,
    }).promise();
    return Promise.all(
      list.Contents.map(async (o) => {
        const object = await this.client.getObject({
          Bucket: this.bucket,
          Key: o.Key,
        }).promise();
        return {
          name: o.Key.replace(prefix, ''),
          content: JSON.parse(object.Body.toString()),
        };
      }),
    );
  }

  /**
   * Shutdown module
   */
  shutdown() {
    if (this.client) {
      this.client = null;
    }
  }
}

module.exports = S3;
