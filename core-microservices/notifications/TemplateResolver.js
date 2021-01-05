const handlebars = require('handlebars');
const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');

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
   * Update template. The template is inserted/updated in the S3 bucket.
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
   * Get template. A template is a function which takes an object as parameter.
   * The members of the object are inserted in the template.
   * If there is no template for the given keys. a default template is used instead.
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
      tmplString = await this._s3.getObject(opts).promise();
    } catch (error) {
      try {
        // if the file doesn't exist
        tmplString = await this._s3.getObject({
          Bucket: this._config.bucket,
          Key: `templates/default/${transport}/${event}.html`,
        }).promise();
      } catch (error2) {
        tmplString = { Body: 'Template not found' };
      }
    }

    return handlebars.compile(tmplString.Body.toString());
  }

  /**
   * Setup Default Templates
   * @param {string} transport
   * @param {string} dirname
   */
  async setupDefaultTemplates(transport, dirname) {
    const filenames = await fs.readdir(dirname);
    await Promise.all(_.map(filenames, async (filename) => {
      const content = await fs.readFile(path.join(dirname, filename), 'utf-8');
      this.updateTemplate('default', transport, filename, content);
    }));
  }
}

module.exports = TemplateResolver;
