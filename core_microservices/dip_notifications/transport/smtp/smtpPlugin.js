const emailjs = require('emailjs');

/**
 * SMTP notifications plugin
 */
class SmtpPlugin {
  /**
   * constructor
   * @param {{}} opts
   */
  constructor({
    SMTP_USERNAME,
    SMTP_PASSWORD,
    SMTP_HOST,
    SMTP_USE_SSL,
  }) {
    this.transportName = 'smtp';
    this.mailer = emailjs.server.connect({
      user: SMTP_USERNAME,
      password: SMTP_PASSWORD,
      host: SMTP_HOST,
      ssl: SMTP_USE_SSL,
    });
  }

  /**
   * Send the message
   * @param {{}} message
   * @param {string} body
   * @return {Promise}
   */
  send({
    from,
    recipient,
    subject,
    attachments,
  }, body) {
    return new Promise((resolve, reject) => {
      this.mailer.send({
        from,
        to: recipient,
        subject,
        text: '',
        attachment: [
          { data: body, alternative: true },
          ...attachments,
        ],
      }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = SmtpPlugin;
