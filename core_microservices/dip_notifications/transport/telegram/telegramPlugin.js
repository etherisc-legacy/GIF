const TelegramBot = require('telegrambot');

/**
 * Telegram notifications plugin
 */
class TelegramPlugin {
  /**
   * constructor
   * @param {{}} s3
   * @param {{}} opts
   */
  constructor(s3, { BOT_TOKEN }) {
    this.transportName = 'telegram';
    this.api = new TelegramBot(BOT_TOKEN);
  }

  /**
   * Send the message
   * @param {{}} message
   * @param {string} body
   * @return {Promise}
   */
  send({
    chatId,
  }, body) {
    return new Promise((resolve, reject) => {
      this.api.sendMessage({
        chat_id: chatId,
        text: body,
        parse_mode: 'Markdown',
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

module.exports = TelegramPlugin;
