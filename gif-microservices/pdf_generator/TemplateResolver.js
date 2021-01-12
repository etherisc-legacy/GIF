const handlebars = require('handlebars');
const moment = require('moment');
const fs = require('fs-extra');

/**
 * Template resolver
 */
class TemplateResolver {
  /**
   * Constructor
   * @param {{}} config
   * @param {{}} s3
   */
  constructor(config, s3) {
    this.config = config;
    this.s3 = s3.client;

    handlebars.registerHelper({
      date: value => `${moment(value).utcOffset(moment.parseZone(value).utcOffset()).format('MMMM DD, YYYY HH:mm')} (local time)`,
      money: value => Number((Number(value) / 100).toFixed(2)),
    });
  }

  /**
   * Update template. The template is inserted/updated in the S3 bucket.
   * @param {string} productId
   * @param {string} name
   * @param {string} template
   * @return {Promise<void>}
   */
  async updateTemplate(productId, name, template) {
    await this.s3.putObject({
      Bucket: this.config.bucket,
      Key: `templates/${productId}/${name}.html`, // `templates/${product}/${tmpl.name}.html`,
      Body: template,
    }).promise();
  }

  /**
   * Get template by name
   * @param {string} productId
   * @param {string} templateName
   * @return {function}
   */
  async getTemplate(productId, templateName) {
    let tmplString = '';
    try {
      const opts = {
        Bucket: this.config.bucket,
        Key: `templates/${productId}/${templateName}.html`, // `templates/${product}/${templateName}.html`
      };
      // check if the file exists
      await this.s3.headObject(opts).promise();
      tmplString = await this.s3.getObject(opts).promise();
    } catch (error) {
      // if the file doesn't exist
      tmplString = await this.s3.getObject({
        Bucket: this.config.bucket,
        Key: 'templates/default/templateNotFound.html', // templates/${product}/${templateName}.html`
      }).promise();
    }

    return handlebars.compile(tmplString.Body.toString());
  }

  /**
   * Setup default template(s). Currently only 1 template.
   */
  async setupDefaultTemplates() {
    await this.s3.putObject({
      Bucket: this.config.bucket,
      Key: 'templates/default/templateNotFound.html',
      Body: await fs.readFile('./templates/default/templateNotFound.html', 'utf-8'),
    }).promise();
  }
}

module.exports = TemplateResolver;
