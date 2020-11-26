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
    await this.templateResolver.setupDefaultTemplates();
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
      handler: this.settingsUpdate.bind(this),
    });
  }

  /**
   *
   * @param {{}} message
   * @returns {Promise<void>}
   */
  async settingsUpdate({ content, fields, properties }) {
    const { templates } = content;

    this.productId = 'fdd'; // todo: use correct productId

    for (let i = 0, l = templates.length; i < l; i += 1) {
      const { name, template } = templates[i];
      await this.templateResolver.updateTemplate(this.productId, name, template);
    }
    /*
    await this.amqp.publish({
      messageType: 'pdfTemplatesUpdateSuccess',
      messageVersion: '1.*',
      content: {},
      correlationId: properties.correlationId,
    });
 */
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

    // policyGetRequest is handled by PolicyStorage and will result in policyGetResponse message.
    await this.amqp.publish({
      messageType: 'policyGetRequest',
      messageVersion: '1.*',
      content: { policyId },
      correlationId: properties.correlationId,
    });
  }

  /**
   * Handle get policy message
   * @param {string} productId
   * @param {string} templateName
   * @param {{}} data
   * @return {Promise<void>}
   */
  async generatePdf(productId, templateName, data) {
    const template = await this.templateResolver.getTemplate(productId, templateName);
    const htmlString = template(data);
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlString, { waitUntil: 'networkidle0', networkIdleTimeout: 5000 });
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

    await browser.close();

    return pdf;
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

    const pdf = await this.generatePdf(this.productId, 'certificate', policy);
    this.log.info(`Certificate for ${policy.id} generated`);
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
