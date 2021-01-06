const _ = require('lodash');


/**
 * Notifications service
 */
class NotificationsService {
  /**
   * constructor
   * @param {TemplateResolver} templateResolver
   * @param {{}} options
   * @param {[]} plugins
   * @param {Object} log
   */
  constructor({
    templateResolver,
    options,
    plugins,
    log,
  }) {
    this.templateResolver = templateResolver;
    this.options = options;
    this.plugins = plugins;
    this.log = log;
  }

  /**
   * Send notification
   * @param {string} productId
   * @param {{}} settings
   * @param {{}} message
   */
  async send(productId, settings, message) {
    const { type, data } = message;
    const { transports } = settings;
    for (let i = 0, l = transports.length; i < l; i += 1) {
      const transport = transports[i];
      if (transport.events.indexOf(type) >= 0 && _.some(this.plugins, ['transportName', transport.name])) {
        const plugin = _.find(this.plugins, ['transportName', transport.name]);
        const template = await this.templateResolver.getTemplate(productId, transport.name, type);
        await plugin.send({ ...message.props, ...transport.props }, template(data));
        this.log.info(`Notification sent: ${type} on ${transport.name} for ${productId}`);
      }
    }
  }
}

module.exports = NotificationsService;
