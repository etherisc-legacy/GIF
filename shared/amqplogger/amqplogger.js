module.exports = class AmqpLogger {
  /**
   * Constructor
   * @param {Amqp} amqp
   * @param {log} log
   */
  constructor({ amqp, log }) {
    this._amqp = amqp;
    this._log = log;
  }

  /**
   * Start application
   * @return {Promise<void>}
   */
  async bootstrap() {
    await this._amqp.consume({
      messageType: '*',
      messageVersion: '1.*',
      handler: this.amqpLog.bind(this),
    });
  }

  /**
   * Event Handler
   * @param {object} content
   * @param {object} fields
   * @param {object} properties
   */
  amqpLog({ content, fields, properties }) {
    let cshort = '';
    try {
      cshort = JSON.stringify(content).slice(0, 60);
    } catch (e) {
      cshort = 'Bad content';
    }
    this._log.info(properties.headers.messageType, ': ', properties.headers.originatorName, ': ', cshort); // JSON.stringify(content).slice(60));
  }
};
