/* global web3: true, assert: true */

/**
 * Assetion for revert opcode
 * @param {Error} error
 */
function assertRevert(error) {
  const revertFound = error.message.search('revert') >= 0;
  assert(revertFound, `Expected "revert", got ${error} instead`);
}

/**
 * Mine new block
 * @return {Promise}
 */
function advanceBlock() {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: Date.now(),
    }, (err, res) => (err ? reject(err) : resolve(res)));
  });
}

/**
 * Returns last blocks timestamp
 * @return {number}
 */
function latestTime() {
  return new Promise((resolve, reject) => web3.eth.getBlock('latest', (err, res) => (err ? reject(err) : resolve(res.timestamp))));
}

/**
 * [increaseTime description]
 * @param  {[type]} duration [description]
 * @return {[type]}          [description]
 */
function increaseTime(duration) {
  const idnow = Date.now();

  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration],
      id: idnow,
    }, (err1) => {
      if (err1) return reject(err1);

      return web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: idnow + 1,
      }, (err2, res) => (err2 ? reject(err2) : resolve(res)));
    });
  });
}

/**
 * Beware that due to the need of calling two separate testrpc methods and rpc calls overhead
 * it's hard to increase time precisely to a target point so design your test to tolerate
 * small fluctuations from time to time.
 *
 * @param {number} target time in seconds
 */
async function increaseTimeTo(target) {
  const now = await latestTime();
  if (target < now) throw Error(`Cannot increase current time(${now}) to a moment in the past(${target})`);
  const diff = target - now;
  await increaseTime(diff);
}

const duration = {
  /**
   * Return number of seconds
   * @param {number} val
   * @return {number}
   */
  seconds(val) {
    return val;
  },
  /**
   * Return number of seconds in defined number of minutes
   * @param {number} val
   * @return {number}
   */
  minutes(val) {
    return val * this.seconds(60);
  },
  /**
   * Return number of seconds in defined number of hours
   * @param {number} val
   * @return {number}
   */
  hours(val) {
    return val * this.minutes(60);
  },
  /**
   * Return number of seconds in defined number of days
   * @param {number} val
   * @return {number}
   */
  days(val) {
    return val * this.hours(24);
  },
  /**
   * Return number of seconds in defined number of weeks
   * @param {number} val
   * @return {number}
   */
  weeks(val) {
    return val * this.days(7);
  },
  /**
   * Return number of seconds in defined number of years
   * @param {number} val
   * @return {number}
   */
  years(val) {
    return val * this.days(365);
  },
};

module.exports = {
  assertRevert, latestTime, increaseTimeTo, duration, advanceBlock,
};
