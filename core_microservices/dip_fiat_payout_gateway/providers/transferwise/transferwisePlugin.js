const uuid = require('uuid');
const TransferwiseClient = require('./transferwiseClient');


/**
 * Transferwise plugin
 */
class TransferwisePlugin {
  /**
   * Constructor
   * @param {object} config
   * @param {object} log
   */
  constructor(config, log) {
    this.transferwiseClient = new TransferwiseClient(config, log);
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
    await this.transferwiseClient.refreshAccessToken();

    const [account, quote] = await Promise.all([
      this.transferwiseClient.createAccount(name, currency, email),
      this.transferwiseClient.createQuote(currency, amount),
    ]);

    const transfer = await this.transferwiseClient.makeTransfer(account.id, quote.id, uuid());
    return transfer;
  }

  /**
   * Process payout
   * @param {*} transfer
   */
  async processPayout({ id }) {
    const response = await this.transferwiseClient.fundTransfer(id);
    return response;
  }
}

module.exports = TransferwisePlugin;
