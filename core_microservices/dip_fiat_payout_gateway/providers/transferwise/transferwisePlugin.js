const uuid = require('uuid');
const TransferwiseClient = require('./transferwiseClient');


/**
 * Transferwise plugin
 */
class TransferwisePlugin {
  /**
   * Constructor
   * @param {object} config
   */
  constructor(config) {
    this.transferwiseClient = new TransferwiseClient(config);
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
    const quote = await this.transferwiseClient.createQuote(String(currency).toUpperCase(), amount);
    const account = await this.transferwiseClient.createAccount(name, String(currency).toUpperCase(), email);
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
