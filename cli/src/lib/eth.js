const _ = require('lodash');
const networksLookup = require('eth-cli/src/networks');

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

module.exports = {
  networkByName,
  networkById,
};
