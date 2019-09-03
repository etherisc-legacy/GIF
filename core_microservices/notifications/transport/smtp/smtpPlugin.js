const emailjs = require('emailjs');

/**
 * SMTP notifications plugin
 */
class SmtpPlugin {
  /**
   * constructor
   * @param {{}} s3
   * @param {{}} opts
   */
  constructor(s3, {
    SMTP_USERNAME,
    SMTP_PASSWORD,
    SMTP_HOST,
    SMTP_USE_SSL,
  }) {
    this.transportName = 'smtp';
    this.s3 = s3.client;
    this.mailer = emailjs.server.connect({
      user: SMTP_USERNAME,
      password: SMTP_PASSWORD,
      host: SMTP_HOST,
      ssl: SMTP_USE_SSL === 'true',
    });
  }

  /**
   * Send the message
   * @param {{}} message
   * @param {string} body
   * @return {Promise}
   */
  async send({
    from,
    recipient,
    subject,
    attachments = [],
  }, body) {
    const _attachments = [];

    for (let i = 0, l = attachments.length; i < l; i += 1) {
      const {
        bucket,
        path,
        type,
        name,
      } = attachments[i];
      const file = await this.s3.getObject({ Bucket: bucket, Key: path }).promise();
      _attachments[i] = { data: file.Body, type, name };
    }

    await new Promise((resolve, reject) => {
      this.mailer.send({
        from,
        to: recipient,
        subject,
        text: '',
        attachment: [
          { data: body, alternative: true },
          ..._attachments,
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
