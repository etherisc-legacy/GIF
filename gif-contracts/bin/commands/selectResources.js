const yaml = require('js-yaml');
const fs = require('fs-jetpack');
const path = require('path');
const { Command } = require('@oclif/command');
const log = require('../lib/logger');


/**
 *
 */
class selectResources extends Command {
  /**
   * Put symlinks for selected resources
   *
   * @param {string} dir
   * @param {string[]} resources
   */
  selectResources(dir, resources) {
    // console.log(fs.list(dir));

    fs.dir(dir); // create dir if necessary
    fs.list(dir)
      .filter(file => file !== '.keep')
      .forEach(file => fs.remove(`${dir}/${file}`));

    if (resources && resources.length) {
      resources.forEach((file) => {
        const src = path.resolve(`${dir}_available/${file}`);
        const dest = path.resolve(`${dir}/${file}`);

        if (fs.exists(src)) {
          fs.symlink(src, dest);
          log.info(`Selected ${dir}: ${dir}/${file}`);
        } else {
          log.error(`${dir}_available/${file} doesn't exists`);
        }
      });
    }
  }

  /**
     * Run resources selection
     *
     */
  run() {
    try {
      // console.log(process.cwd());
      // console.log(yaml.safeLoad(fs.read('resources.yml')));
      const { contracts, migrations, test } = yaml.safeLoad(fs.read('resources.yml'));

      this.selectResources('contracts', contracts);
      this.selectResources('migrations', migrations);
      this.selectResources('test', test);
    } catch (e) {
      log.error(e);
    }
  }
}

module.exports = selectResources;
