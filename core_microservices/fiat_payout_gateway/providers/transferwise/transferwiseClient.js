const fetch = require('node-fetch');
const btoa = require('btoa');


/**
 * Transferwise plugin
 */
class TransferwiseClient {
  /**
   * Сonstructor
   * @param {*} config
   * @param {*} log
   */
  constructor({
    profileId,
    url,
    token,
    login,
    password,
  }, log) {
    this.profileId = profileId;
    this.url = url;
    this.login = login;
    this.password = password;
    this.token = token;

    this.log = log;

    this.refreshAccessToken();
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
      source: process.env.TRANSFERWISE_SRC_CURRENCY,
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

  /**
   * Get Access Token
   */
  async getAccessToken() {
    const data = `grant_type=refresh_token&refresh_token=${this.token}`;
    const response = await fetch(`${this.url}/oauth/token`, {
      method: 'POST',
      body: data,
      headers: {
        Authorization: `Basic ${btoa(`${this.login}:${this.password}`)}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    const json = await response.json();

    return json.access_token;
  }

  /**
   * Refresh Access Token
   */
  refreshAccessToken() {
    this.accessToken = this
      .getAccessToken()
      .catch(e => this.log.error(e));
  }
}

module.exports = TransferwiseClient;
