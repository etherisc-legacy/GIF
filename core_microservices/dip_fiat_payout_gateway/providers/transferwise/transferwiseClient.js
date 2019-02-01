const fetch = require('node-fetch');


const SRC_CURRENCY = process.env.TRANSFERWISE_SRC_CURRENCY;

/**
 * Transferwise plugin
 */
class TransferwiseClient {
  /**
   * Сonstructor
   * @param {*} param0
   */
  constructor({
    profileId,
    url,
    token,
  }) {
    this.profileId = profileId;
    this.url = url;
    this.accessToken = token;
  }

  /**
   * Create account
   * @param {*} name
   * @param {*} currency
   * @param {*} email
   */
  async createAccount(name, currency, email) {
    const accountHolderName = name.replace(/[\d]/g, '');
    const data = {
      profile: this.profileId,
      accountHolderName,
      type: 'email',
      currency,
      details: { email },
    };

    const response = await fetch(`${this.url}/v1/accounts`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${await this.accessToken}`,
        'content-type': 'application/json;charset=utf-8',
      },
    });

    return response.json();
  }

  /**
   * Create Quote
   * @param {*} currency
   * @param {*} amount
   */
  async createQuote(currency, amount) {
    const data = {
      profile: this.profileId,
      source: SRC_CURRENCY,
      target: currency,
      rateType: 'FIXED',
      targetAmount: (amount / 100).toFixed(2),
      type: 'BALANCE_PAYOUT',
    };

    const response = await fetch(`${this.url}/v1/quotes`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${await this.accessToken}`,
        'content-type': 'application/json;charset=utf-8',
      },
    });

    return response.json();
  }

  /**
   * Make transfer
   * @param {*} targetAccount
   * @param {*} quote
   * @param {*} customerTransactionId
   */
  async makeTransfer(targetAccount, quote, customerTransactionId) {
    const data = { targetAccount, quote, customerTransactionId };

    const response = await fetch(`${this.url}/v1/transfers`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${await this.accessToken}`,
        'content-type': 'application/json;charset=utf-8',
      },
    });

    return response.json();
  }

  /**
   * Fund transfer
   * @param {*} transferId
   */
  async fundTransfer(transferId) {
    const data = { type: 'BALANCE' };

    const response = await fetch(`${this.url}/v1/transfers/${transferId}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${await this.accessToken}`,
        'content-type': 'application/json;charset=utf-8',
      },
    });

    return response.json();
  }
}

module.exports = TransferwiseClient;
