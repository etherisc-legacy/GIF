const fs = require('fs');
const uuid = require('uuid');

/**
 * Demo payout plugin, does not actually do any payouts
 */
class DemoPlugin {
  /**
     * Constructor
     * @param {object} log
     * @param {object} amqp
     */
  constructor(log, amqp) {
    this.log = log;
    this.amqp = amqp;

    this.amqp.publish({
      messageType: 'notificationSettingsUpdate',
      messageVersion: '1.*',
      content: {
        transports: [
          {
            name: 'smtp',
            props: { from: 'demo_payout@etherisc.com' },
            events: ['demo_payout'],
          },
        ],
        templates: [
          {
            name: 'demo_payout',
            transport: 'smtp',
            template: fs.readFileSync('./providers/demo/templates/demo_payout.html', 'utf8'),
          },
        ],
      },
    });
  }

  /**
     * Initialize payout
     * @param {string} name
     * @param {string} email
     * @param {string} currency
     * @param {number} amount
     * @return {Promise<object>}
     */
  async initializePayout({
    name,
    email,
    currency,
    amount,
    policyId,
  }) {
    this.log.info(`Initializing demo payout of ${amount} ${currency} to ${name}(${email})`);

    await this.amqp.publish({
      messageType: 'notification',
      messageVersion: '1.*',
      content: {
        type: 'demo_payout',
        data: {
          name, currency, amount: (amount / 100), policyId,
        },
        props: {
          recipient: email,
          subject: 'Insurance Test Policy has been paid out',
        },
      },
    });

    return new Promise((resolve) => {
      const newId = uuid();
      this.log.info(`New demo payout ID: ${newId}`);
      resolve({ id: newId });
    });
  }

  /**
     * Process payout
     * @param {*} transfer
     */
  async processPayout({ id }) {
    this.log.info(`Processing demo payout for ID #${id}`);
    return Promise.resolve({ message: 'Demo payout success', errorCode: null });
  }
}

module.exports = DemoPlugin;
