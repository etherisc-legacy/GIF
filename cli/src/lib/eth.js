const _ = require('lodash');
const networksLookup = require('eth-cli/src/networks');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');


/**
 * Get network info by network name
 * @param {String} name
 * @return {Object|null}
 */
function networkByName(name) {
  return networksLookup[name] || null;
}

/**
 * Get network info by network id
 * @param {Number} id
 * @return {Object|null}
 */
function networkById(id) {
  const name = _.findKey(networksLookup, n => n.id === parseInt(id, 10));

  if (!name) return null;

  return networkByName(name);
}

/**
 * Web3 with HDWalletProvider
 * @param {String} mnemonic
 * @param {String} httpProvider
 * @return {Web3}
 */
function signer(mnemonic, httpProvider) {
  const { MNEMONIC, HTTP_PROVIDER } = process.env;

  if (!MNEMONIC && !mnemonic) {
    throw new Error('MNEMONIC not defined');
  }

  if (!HTTP_PROVIDER && !httpProvider) {
    throw new Error('HTTP_PROVIDER not defined');
  }

  return new Web3(new HDWalletProvider(MNEMONIC, HTTP_PROVIDER, 0, 1, false));
}

module.exports = {
  networkByName,
  networkById,
  signer,
};
