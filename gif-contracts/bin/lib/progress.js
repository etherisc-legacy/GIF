const fs = require('fs-jetpack');
const { info } = require('../../io/logger');


const progressFile = './deploymentProgress.json';

let bar = {};

/**
 *
 * @param{string[]} requirements
 */
const requires = (requirements) => {
  requirements.forEach((step) => {
    bar = bar || fs.read(progressFile, 'json');
    if (!bar[step]) {
      info(`Step ${step} is required but not fulfilled - exiting.`);
      process.exit(0);
    } else {
      info(`Step ${step} is required and fulfilled.`);
    }
  });
};

/**
 *
 * @param{string[]} fulfills
 * @returns{boolean}
 */
const check = (fulfills) => {
  bar = bar || fs.read(progressFile, 'json');
  const passed = fulfills.reduce((pass, step) => pass && bar[step], true);

  if (passed) {
    info(`Step ${fulfills.join('/')} is fulfilled and can be skipped.`);
  } else {
    info(`Step ${fulfills.join('/')} will be deployed.`);
  }

  return passed;
};

/**
 *
 * @param{string[]} fulfills
 */
const fulfill = (fulfills) => {
  fulfills.forEach((step) => {
    bar[step] = true;
    fs.write(progressFile, bar);
    info(`Step ${step} fulfilled.`);
  });
};

/**
 *
 * @param {string[]} requirements
 * @param {string[]} fulfills
 * @param {*} deployment
 * @returns {function(*=): Promise<void>}
 */
const progress = (requirements, fulfills, deployment) => (async (deployer, networks, accounts) => {
  await deployment(deployer, networks, accounts);

  /*
  requires(requirements);
  if (!check(fulfills)) {
    await deployment(deployer);
  }
  fulfill(fulfills);

   */
});


module.exports = progress;
