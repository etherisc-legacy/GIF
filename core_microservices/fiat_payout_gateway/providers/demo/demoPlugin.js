const uuid = require('uuid');

/**
 * Demo payout plugin, does not actually do any payouts
 */
class DemoPlugin {
  /**
     * Constructor
     * @param {object} log
     */
  constructor(log) {
    this.log = log;
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
  }) {
    this.log.info(`Initializing demo payout of ${amount} ${currency} to ${name}(${email})`);
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
