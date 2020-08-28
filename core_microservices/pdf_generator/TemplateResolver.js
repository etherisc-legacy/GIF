const handlebars = require('handlebars');
const moment = require('moment');

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
   * Get template by name
   * @param {string} templateName
   * @param {{}} data
   * @return {function}
   */
  async getTemplate(templateName, data) {
    let tmplString = '';
    try {
      const opts = {
        Bucket: this.config.bucket,
        Key: `templates/${templateName}.html`, // `templates/${product}/${templateName}.html`
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

    const template = handlebars.compile(tmplString.Body.toString());
    return config => template({ data, config });
  }
}

module.exports = TemplateResolver;
