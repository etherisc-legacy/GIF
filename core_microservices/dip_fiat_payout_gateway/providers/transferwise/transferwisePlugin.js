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
    const account = await this.transferwiseClient.createAccount(name, currency, email);
    const quote = await this.transferwiseClient.createQuote(currency, amount);
    const transfer = await this.transferwiseClient.makeTransfer(account.id, quote.id, uuid());
    return transfer;
  }

  /**
   * Process payout
   * @param {*} transfer
   */
  async processPayout({ id }) {
    await this.transferwiseClient.fundTransfer(id);
  }
}

module.exports = TransferwisePlugin;
