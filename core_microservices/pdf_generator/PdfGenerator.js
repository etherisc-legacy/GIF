const fs = require('fs');
const puppeteer = require('puppeteer');
const TemplateResolver = require('./TemplateResolver');

/**
 * DIP PDF Generator microservice
 */
class PdfGenerator {
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
    this.templateResolver = new TemplateResolver(this.config, s3);
  }

  /**
   * Start application
   * @return {Promise<void>}
   */
  async bootstrap() {
    this.amqp.consume({
      messageType: 'issueCertificate',
      messageVersion: '1.*',
      handler: this.issueCertificate.bind(this),
    });
    this.amqp.consume({
      messageType: 'policyGetResponse',
      messageVersion: '1.*',
      handler: this.policyGetResponse.bind(this),
    });
    this.amqp.consume({
      messageType: 'pdfTemplatesUpdate',
      messageVersion: '1.*',
      handler: this.updateTemplates.bind(this),
    });
    await this.s3.putObject({
      Bucket: this.config.bucket,
      Key: 'templates/default/templateNotFound.html',
      Body: fs.readFileSync('./templates/default/templateNotFound.html'),
    }).promise();
  }

  /**
   * Handle update templates message
   * @param {{}} message
   * @return {Promise<void>}
   */
  async updateTemplates({ content, fields, properties }) {
    const { templates } = content;

    for (let i = 0, l = templates.length; i < l; i += 1) {
      const tmpl = templates[i];
      await this.s3.putObject({
        Bucket: this.config.bucket,
        Key: `templates/${tmpl.name}.html`, // `templates/${product}/${tmpl.name}.html`,
        Body: tmpl.body,
      }).promise();
    }

    await this.amqp.publish({
      messageType: 'pdfTemplatesUpdateSuccess',
      messageVersion: '1.*',
      content: {},
      correlationId: properties.correlationId,
    });
  }

  /**
   * Handle certificate issue message
   * @param {{}} message
   * @return {Promise<void>}
   */
  async issueCertificate({ content, fields, properties }) {
    const { policyId } = content;

    const exists = await this.exists(policyId);

    if (exists) {
      this.log.info(`Certificate already exists ${policyId}`);
      return;
    }

    await this.amqp.publish({
      messageType: 'policyGetRequest',
      messageVersion: '1.*',
      content: { policyId },
      correlationId: properties.correlationId,
    });
  }

  /**
   * Handle get policy message
   * @param {{}} message
   * @return {Promise<void>}
   */
  async policyGetResponse({ content, fields, properties }) {
    const policy = content;

    const exists = await this.exists(policy.id);

    if (exists) {
      this.log.info(`Certificate already exists ${policy.id}`);
      return;
    }

    const template = await this.templateResolver.getTemplate(policy);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(template(this.config), { waitUntil: 'networkidle', networkIdleTimeout: 5000 });
    await page.emulateMedia('screen');

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { // Word's default A4 margins
        top: '2.54cm',
        bottom: '2.54cm',
        left: '2.54cm',
        right: '2.54cm',
      },
    });
    this.log.info(`Certificate for ${policy.id} generated`);

    await browser.close();

    const fileKey = `pdf/certificate-${policy.id}.pdf`;
    await this.s3.putObject({
      Bucket: this.config.bucket,
      ACL: 'public-read',
      Key: fileKey, // `pdf/${product}/${templateName}-${policy.id}.pdf`,
      Body: pdf,
      ContentType: 'binary',
    }).promise();
    this.log.info(`Certificate for ${policy.id} successfully stored at ${fileKey}`);

    await this.amqp.publish({
      messageType: 'certificateIssued',
      messageVersion: '1.*',
      content: {
        policyId: policy.id,
        bucket: this.config.bucket,
        path: `pdf/certificate-${policy.id}.pdf`,
      },
      correlationId: properties.correlationId,
    });
  }

  /**
   * Check if the certeficate already exists
   * @param {*} policyId
   */
  async exists(policyId) {
    try {
      await this.s3.getObject({
        Bucket: this.config.bucket,
        Key: `pdf/certificate-${policyId}.pdf`, // `pdf/${product}/${templateName}-${policy.id}.pdf`,
      }).promise();
    } catch (err) {
      return false;
    }
    return true;
  }
}

module.exports = PdfGenerator;
