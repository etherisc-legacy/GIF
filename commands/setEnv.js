const { Command } = require('@oclif/command');
const fs = require('fs-jetpack');
const config = require('../.gif.config.js');

/**
 * Create and distribute .env files
 */
class SetEnv extends Command {
  /**
   * Check if parameter is object
   * @param {{}} a
   * @returns {boolean|boolean}
   */
  isObject(a) {
    return (!!a) && (a.constructor === Object);
  }

  /**
   * Compute Environment variables
   * @param {{}} env
   * @param {string} nodeEnv
   * @returns {{}}
   */
  getEnv(env, nodeEnv) {
    const computedEnv = {};
    Object.keys(env).forEach((key) => {
      computedEnv[key] = this.isObject(env[key]) ? env[key][nodeEnv] : env[key];
    });
    return computedEnv;
  }

  /**
   * Run deploy command
   * @return {Promise<void>}
   */
  async run() {
    for (let idx = 0; idx < config.envFiles.length; idx += 1) {
      const pkg = config.envFiles[idx];
      for (let idx2 = 0; idx2 < pkg.environments.length; idx2 += 1) {
        const nodeEnv = pkg.environments[idx2];
        const filename = `${pkg.path}/.env.${nodeEnv}`;
        console.log(`Writing ${filename} ...`);
        fs.write(filename, `
#
# Environment variables for ${pkg.name}, environment ${nodeEnv}
#
# This is a generated file. Don't modify it.
# Instead, modify .gif.config.js and run ./bin/run setEnv
#
`);
        const keys = Object.keys(pkg.vars);
        for (let idx3 = 0; idx3 < keys.length; idx3 += 1) {
          const sectionName = keys[idx3];
          const section = this.getEnv(pkg.vars[sectionName], nodeEnv);
          fs.append(filename, `\n#\n# Section: ${sectionName}\n#\n`);
          const sectionKeys = Object.keys(section);
          for (let idx4 = 0; idx4 < sectionKeys.length; idx4 += 1) {
            fs.append(filename, `${sectionKeys[idx4]}="${section[sectionKeys[idx4]]}"\n`);
          }
        }
      }
    }
  }
}

SetEnv.description = 'Create and distribute env files';

module.exports = SetEnv;
