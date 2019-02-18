require('dotenv').config();
const { Command } = require('@oclif/command');
const fetch = require('node-fetch');
const btoa = require('btoa');


const profileId = process.env.TRANSFERWISE_PROFILE_ID;
const url = process.env.TRANSFERWISE_API_URL;
const token = process.env.TRANSFERWISE_API_TOKEN;
const login = process.env.TRANSFERWISE_LOGIN;
const password = process.env.TRANSFERWISE_PASSWORD;


/**
 * today date
 * @return {string}
 */
function yesterday() {
  const date = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  return `${date.getFullYear()}-${(mm > 9 ? '' : '0') + mm}-${(dd > 9 ? '' : '0') + dd}`;
}

/**
 * yesterday date
 * @return {string}
 */
function tomorrow() {
  const date = new Date(Date.now() + 1000 * 60 * 60 * 24);
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  return `${date.getFullYear()}-${(mm > 9 ? '' : '0') + mm}-${(dd > 9 ? '' : '0') + dd}`;
}

/**
 * Get access token
 * @return {string}
 */
async function getAccessToken() {
  const response = await fetch(`${url}/oauth/token`, {
    method: 'POST',
    body: `grant_type=refresh_token&refresh_token=${token}`,
    headers: {
      Authorization: `Basic ${btoa(`${login}:${password}`)}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
  const { access_token: accessToken } = await response.json();

  return accessToken;
}

/**
 * Get active transfers
 * @param {string} accessToken
 */
async function getTransfers(accessToken) {
  const response = await fetch(`${url}/v1/transfers/?offset=0&limit=100&profile=${profileId}&createdDateStart=${yesterday()}&createdDateEnd=${tomorrow()}&status=waiting_recipient_input_to_proceed`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const transfers = await response.json();
  return transfers;
}

/**
 * Cancel transfer
 * @param {string} accessToken
 * @param {number} transferId
 */
async function cancelTransfer(accessToken, transferId) {
  const response = await fetch(`${url}/v1/transfers/${transferId}/cancel`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  await response.json();
}

/**
 * Cancel Transferwise transfers
 */
class CancelTransferwiseTransfers extends Command {
  /**
   * Cancel all active transfers
   */
  async run() {
    const accessToken = await getAccessToken();
    const transfers = await getTransfers(accessToken);

    if (transfers.errors) {
      console.log('Something went wrong, try again');
      return;
    }

    console.log(`${transfers.length} transfers found`);

    for (let i = 0, l = transfers.length; i < l; i += 1) {
      await cancelTransfer(accessToken, transfers[i].id);
      console.log(`Transfer ${transfers[i].id} canceled`);
    }
  }
}

module.exports = CancelTransferwiseTransfers;
