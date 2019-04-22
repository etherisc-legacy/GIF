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
    await this.transferwiseClient.refreshAccessToken();

    const [account, quote] = await Promise.all([
      this.transferwiseClient.createAccount(name, currency, email),
      this.transferwiseClient.createQuote(currency, amount),
    ]);
    this.log.info(`Creating a pending transfer for quote #${quote.id}`);
    const transfer = await this.transferwiseClient.makeTransfer(account.id, quote.id, uuid());
    this.log.info(`Transfer created: ${JSON.stringify(transfer)}`);
    return transfer;
  }

  /**
   * Process payout
   * @param {*} transfer
   */
  async processPayout({ id }) {
    this.log.info(`Making fund request for transfer #${id}`);
    const response = await this.transferwiseClient.fundTransfer(id);
    this.log.info(`Fund request response: ${JSON.stringify(response)}`);
    if (response.errorCode !== null) {
      throw new Error(`Transferwise error: ${response.errorCode}`);
    }
    return response;
  }
}

module.exports = TransferwisePlugin;
