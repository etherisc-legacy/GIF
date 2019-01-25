const handlebars = require('handlebars');

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
  }

  /**
   * Get template by name
   * @param {{}} policy
   * @return {function}
   */
  async getTemplate(policy) {
    let tmplString = '';
    try {
      const opts = {
        Bucket: this.config.bucket,
        Key: 'templates/certificate.html', // `templates/${product}/${templateName}.html`
      };
      // check if the file exists
      await this.s3.headObject(opts).promise();
      tmplString = await this.s3.getObject(opts).promise();
    } catch (error) {
      // if the file doesn't exist
      tmplString = await this.s3.getObject({
        Bucket: this.config.bucket,
        Key: 'templates/default/certificate.html', // `templates/${product}/${templateName}.html`
      }).promise();
    }

    const template = handlebars.compile(tmplString.Body.toString());
    return config => template({ policy, config });
  }
}

module.exports = TemplateResolver;
