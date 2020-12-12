require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });
const { fabric } = require('@etherisc/microservice');
const { deleteTestBucket } = require('@etherisc/microservice/test/helpers');
const _ = require('lodash');
const sinon = require('sinon');
const uuid = require('uuid');
const Notifications = require('../Notifications');
const { constants: tables, schema } = require('../knexfile');


const requiredEnv = ['SMTP_USERNAME', 'SMTP_PASSWORD', 'SMTP_HOST', 'SMTP_USE_SSL', 'BOT_TOKEN'];
let schema2 = schema;

describe('Notifications microservice', () => {
  before(async () => {
    if (schema2.trim() === '') schema2 = 'notifications';
    const config = {
      db: true,
      amqp: true,
      s3: true,
      messageBroker: 'amqp://platform:guest@localhost:5673/trusted',
      bucket: uuid.v4(),
      appName: process.env.APP_NAME,
      appVersion: process.env.APP_VERSION,
      requiredEnv,
    };
    this.microservice = fabric(Notifications, config);
    await this.microservice.bootstrap();
    this.amqp = this.microservice.amqp;
    this.db = this.microservice.db.getConnection();
    this.s3 = this.microservice.s3;
  });

  beforeEach(async () => {
    sinon.restore();
    await Promise.all(Object.keys(tables).map(key => this.db.raw(`truncate ${schema2}.${tables[key]} cascade`)));
  });

  after(async () => {
    sinon.restore();
    await Promise.all(Object.keys(tables).map(key => this.db.raw(`truncate ${schema2}.${tables[key]} cascade`)));
    await deleteTestBucket(this.s3.client, this.microservice.config.bucket);
    await this.microservice.shutdown();
  });

  it('should insert or update app setttings', async () => {
    const productId = 'fdd'; // todo: use correct productId
    const content = {
      transports: [
        {
          name: 'smtp',
          props: {},
          events: ['application_declined', 'application_error'],
        },
        {
          name: 'telegram',
          props: {},
          events: ['application_declined', 'application_error'],
        },
      ],
      templates: [
        {
          event: 'application_error',
          transport: 'smtp',
          template: '<h1>Application Error {{policy.id}}</h1>',
        },
        {
          event: 'application_error',
          transport: 'telegram',
          template: 'Application Error {{policy.id}}',
        },
      ],
    };

    // insert settings
    await this.microservice.app.settingsUpdate({ content });
    const { ProductSettings } = this.microservice.app._models;
    let [productSettings] = await ProductSettings.query()
      .select('settings')
      .where('productId', productId)
      .limit(1);

    productSettings.settings.should.be.equal(JSON.stringify({ transports: content.transports }));

    let applicationErrorTemplate = await this.microservice.app._templateResolver.getTemplate(productId, 'smtp', 'application_error');
    applicationErrorTemplate({ policy: { id: 1 } }).should.be.equal('<h1>Application Error 1</h1>');

    content.transports = [{
      name: 'smtp',
      props: {},
      events: ['application_declined', 'application_error'],
    }];
    content.templates = [{
      event: 'application_error',
      transport: 'smtp',
      template: '<h1>Application Error Updated Template {{policy.id}}</h1>',
    }];

    // update settings
    await this.microservice.app.settingsUpdate({ content });

    [productSettings] = await ProductSettings.query()
      .select('settings')
      .where('productId', productId)
      .limit(1);
    productSettings.settings.should.be.equal(JSON.stringify({ transports: content.transports }));

    applicationErrorTemplate = await this.microservice.app._templateResolver.getTemplate(productId, 'smtp', 'application_error');
    applicationErrorTemplate({ policy: { id: 1 } }).should.be.equal('<h1>Application Error Updated Template 1</h1>');
  });

  it('should send notification', async () => {
    // const productId = 'fdd'; // todo: use correct productId
    const productSettings = {
      transports: [
        {
          name: 'smtp',
          props: {
            from: 'noreply@etherisc.com',
          },
          events: ['application_declined', 'application_error'],
        },
        {
          name: 'telegram',
          props: {
            chatId: '12345',
          },
          events: ['application_error'],
        },
      ],
      templates: [
        {
          name: 'application_error',
          transport: 'smtp',
          template: '<h1>Application Error {{policy.id}}</h1>',
        },
        {
          name: 'application_error',
          transport: 'telegram',
          template: 'Application Error {{policy.id}}',
        },
      ],
    };

    // insert settings
    await this.microservice.app.settingsUpdate({ content: productSettings });

    _.each(this.microservice.app._notificationsService.plugins, (plugin) => {
      sinon.replace(plugin, 'send', ({
        from,
        recipient,
        subject,
        chatId,
        attachments,
      }, body) => {
        if (plugin.transportName === 'smtp') {
          from.should.be.equal('noreply@etherisc.com');
          recipient.should.be.equal('foo@email.com');
          subject.should.be.equal('Etherisc application error');
        } else if (plugin.transportName === 'telegram') {
          chatId.should.be.equal('12345');
        }

        return Promise.resolve();
      });
    });

    const notification = {
      type: 'application_error',
      data: { policy: { id: 1 } },
      props: {
        recipient: 'foo@email.com',
        subject: 'Etherisc application error',
      },
    };

    await this.microservice.app.handleNotification({ content: notification });
  });
});
