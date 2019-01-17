const handlebars = require('handlebars');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');

/**
 * Template resolver
 */
class TemplateResolver {
  /**
   * constructor
   * @param {{}} s3
   * @param {{}} config
   */
  constructor(s3, config) {
    this._s3 = s3.client;
    this._config = config;
  }

  /**
   * Update template
   * @param {string} productId
   * @param {string} transport
   * @param {string} event
   * @param {string} template
   */
  async updateTemplate(productId, transport, event, template) {
    await this._s3.putObject({
      Bucket: this._config.bucket,
      Key: `templates/${productId}/${transport}/${event}.html`,
      Body: template,
    }).promise();
  }

  /**
   * Get template
   * @param {string} productId
   * @param {string} transport
   * @param {string} event
   */
  async getTemplate(productId, transport, event) {
    let tmplString = '';
    try {
      const opts = {
        Bucket: this._config.bucket,
        Key: `templates/${productId}/${transport}/${event}.html`,
      };
      // check if the file exists
      await this._s3.headObject(opts).promise();
      const file = await this._s3.getObject(opts).promise();
      tmplString = file.Body.toString();
    } catch {
      // if the file doesn't exist
      const file = await this._s3.getObject({
        Bucket: this._config.bucket,
        Key: `templates/default/${transport}/${event}.html`,
      }).promise();
      tmplString = file.Body.toString();
    }

    return handlebars.compile(tmplString);
  }

  /**
   * Setup Default Templates
   * @param {string} transport
   * @param {string} dirname
   */
  async setupDefaultTemplates(transport, dirname) {
    const filenames = await this._readFilenames(dirname);
    const files = await Promise.all(_.map(filenames, filename => this._readFile(path.join(dirname, filename))));
    await Promise.all(_.map(files, file => this.updateTemplate('default', transport, file.filename, file.content)));
  }

  /**
   * Read filenames
   * @param {string} dirname
   * @return {Promise<string[]>}
   */
  _readFilenames(dirname) {
    return new Promise((resolve, reject) => {
      fs.readdir(dirname, (err, filenames) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(filenames);
      });
    });
  }

  /**
   * Read filenames
   * @param {string} filename
   * @return {Promise<{}>}
   */
  _readFile(filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, 'utf-8', (err, content) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ filename: path.basename(filename).replace(/\.[^/.]+$/, ''), content });
      });
    });
  }
}

module.exports = TemplateResolver;
