module.exports = (web3, artifacts) => {
  /**
   * Convert utf8 to bytes with certain length
   * @param {number} num
   * @param {string} str
   * @return {string}
   */
  function bytes(num, str) {
    const length = num * 2 + 2;
    return web3.utils.utf8ToHex(str).substr(0, length).padEnd(length, '0');
  }

  return {
    bytes,
  };
};
