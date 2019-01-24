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

// const { LogDecoder, TxDecoder } = require('eth-decoder').default;
//
//
// module.exports = (artifacts) => {
//   const abi = [
//     artifacts.require('modules/license/License.sol').abi,
//   ];
//
//   const logDecoder = new LogDecoder(abi);
//   const txDecoder = new TxDecoder(abi);
//
//   return { logDecoder, txDecoder };
// };

// const abiDecoder = require('abi-decoder');
//
//
// module.exports = (artifacts) => {
//   abiDecoder.addABI(artifacts.require('modules/license/License.sol').abi);
//
//   return abiDecoder;
// }

// const { parseLog } = require('ethereum-event-logs');
//
//
// module.exports = (artifacts) => {
//   const abi = [
//     artifacts.require('modules/license/License.sol').abi,
//   ];
//
//   return logs => parseLog(logs, [...abi]);
// }
