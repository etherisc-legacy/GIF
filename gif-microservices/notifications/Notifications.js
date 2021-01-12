const path = require('path');
const TemplateResolver = require('./TemplateResolver');
const models = require('./models/module');
const NotificationsService = require('./NotificationsService');
const SmtpPlugin = require('./transport/smtp/smtpPlugin');
const TelegramPlugin = require('./transport/telegram/telegramPlugin');

/**
 * DIP Notifications microservice
 */
class Notifications {
  /**
   * constructor
   */
  constructor({
    db, amqp, s3, log, config,
  }) {
    this._amqp = amqp;
    this._models = models(db);
    const options = process.env;
    this._templateResolver = new TemplateResolver(s3, config);
    this._notificationsService = new NotificationsService({
      templateResolver: this._templateResolver,
      options: { ...options },
      plugins: [
        new SmtpPlugin(s3, { ...options }),
        new TelegramPlugin(s3, { ...options }),
      ],
      log,
    });
  }

  /**
   * Bootstrap method
   */
  async bootstrap() {
    await this._templateResolver.setupDefaultTemplates('smtp', path.join(__dirname, 'transport/smtp/templates'));
    await this._templateResolver.setupDefaultTemplates('telegram', path.join(__dirname, 'transport/telegram/templates'));
    await this._amqp.consume({
      messageType: 'notification',
      messageVersion: '1.*',
      handler: this.handleNotification.bind(this),
    });
    await this._amqp.consume({
      messageType: 'notificationSettingsUpdate',
      messageVersion: '1.*',
      handler: this.settingsUpdate.bind(this),
    });
  }

  /**
   * Handle a new notification
   */
  async handleNotification({ content, fields, properties }) {
    const { ProductSettings } = this._models;
    const productId = 'fdd'; // todo: use correct productId

    const [productSettings] = await ProductSettings.query()
      .select('settings')
      .where('productId', productId)
      .limit(1);

    if (!productSettings) {
      return;
    }

    const settings = JSON.parse(productSettings.settings);

    await this._notificationsService.send(productId, settings, content);
  }

  /**
   * Update app settings
   */
  async settingsUpdate({ content, fields, properties }) {
    const { transports, templates } = content;
    const { ProductSettings } = this._models;
    const productId = 'fdd'; // todo: use correct productId

    const [productSettings] = await ProductSettings.query()
      .where('productId', productId)
      .limit(1);

    // in ProductSettings we keep record on the transports to be used.
    if (productSettings) {
      await ProductSettings.query()
        .update({ settings: JSON.stringify({ transports }) })
        .where({ id: productSettings.id });
    } else {
      await ProductSettings.query()
        .insert({
          productId,
          settings: JSON.stringify({ transports }),
        });
    }

    for (let i = 0, l = templates.length; i < l; i += 1) {
      const { event, transport, template } = templates[i];
      await this._templateResolver.updateTemplate(productId, transport, event, template);
    }
    /*
    await this.amqp.publish({
      messageType: 'notificationSettingsUpdateSuccess',
      messageVersion: '1.*',
      content: {},
      correlationId: properties.correlationId,
    });
    */
  }
}

module.exports = Notifications;
