require('dotenv').config();
const { fabric } = require('@etherisc/microservice');
const { deleteTestBucket } = require('@etherisc/microservice/test/helpers');
const uuid = require('uuid');
const PdfGenerator = require('../PdfGenerator');


const requiredEnv = [];

describe('Pdf Generator microservice', () => {
  before(async () => {
    const config = {
      amqp: true,
      s3: true,
      messageBroker: 'amqp://platform:guest@localhost:5673/trusted',
      bucket: uuid.v4(),
      appName: process.env.APP_NAME,
      appVersion: process.env.APP_VERSION,
      requiredEnv,
    };
    this.config = config;
    this.microservice = fabric(PdfGenerator, config);
    await this.microservice.bootstrap();
    this.amqp = this.microservice.amqp;
    this.s3 = this.microservice.s3;
  });

  beforeEach(async () => {

  });

  after(async () => {
    await deleteTestBucket(this.s3.client, this.microservice.config.bucket);
    await this.microservice.shutdown();
  });

  it('should store and update PDF template', async () => {
    const productId = 'fdd'; // todo: use correct productId
    let content = {
      templates: [{
        name: 'pdf_test_template',
        template: '<h1>PDF Sample Template</h1><p>Firstname: {{customer.firstname}}</p>',
      }],
    };

    // insert settings
    await this.microservice.app.settingsUpdate({ content });

    let sampleTemplate = await this.microservice.app.templateResolver.getTemplate(productId, 'pdf_test_template');
    sampleTemplate({ customer: { firstname: 'John' } }).should.be.equal('<h1>PDF Sample Template</h1><p>Firstname: John</p>');

    content = {
      templates: [{
        name: 'pdf_test_template',
        template: '<h1>PDF Sample Template Update</h1><p>Firstname: {{customer.firstname}}</p>',
      }],
    };

    await this.microservice.app.settingsUpdate({ content });


    sampleTemplate = await this.microservice.app.templateResolver.getTemplate(productId, 'pdf_test_template');
    sampleTemplate({ customer: { firstname: 'John' } }).should.be.equal('<h1>PDF Sample Template Update</h1><p>Firstname: John</p>');
  });

  it('should generate a PDF from template', async () => {
    const productId = 'fdd'; // todo: use correct productId

    const pdf = await this.microservice.app.generatePdf(productId, 'pdf_test_template', { customer: { firstname: 'John' } });
    console.log('PDF: ', pdf);
    await this.s3.client.putObject({
      Bucket: this.config.bucket,
      Key: 'pdf/pdf_test.pdf',
      Body: pdf,
      ContentType: 'binary',
    }).promise();
  });
});
