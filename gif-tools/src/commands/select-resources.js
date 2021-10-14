const yaml = require('js-yaml')
const fs = require('fs-jetpack')
const path = require('path')
const {Command} = require('@oclif/command')
const log = require('../lib/logger')

/**
 *
 */
class SelectResources extends Command {
  /**
   *
   * @param {string} dir The directory to scan
   * @param {{}} resources resources
   */
  selectResources(dir, resources) {
    // console.log(fs.list(dir));

    fs.dir(dir) // create dir if necessary
    fs.list(dir)
    .filter(file => file !== '.keep')
    .forEach(file => fs.remove(`${dir}/${file}`))

    if (resources && resources.length > 0) {
      resources.forEach(file => {
        const src = path.resolve(`${dir}-available/${file}`)
        const dest = path.resolve(`${dir}/${file}`)

        if (fs.exists(src)) {
          fs.symlink(src, dest)
          log.info(`Selected ${dir}: ${dir}/${file}`)
        } else {
          log.error(`${dir}_available/${file} doesn't exists`)
        }
      })
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
      const configFile = 'resources.yml'
      if (fs.exists(configFile)) {
        const config = fs.read('resources.yml')
        const {contracts, migrations, test} = yaml.load(config)
        this.selectResources('contracts', contracts)
        this.selectResources('migrations', migrations)
        this.selectResources('test', test)
      } else throw new Error(`${configFile} not found.`)
    } catch (error) {
      log.error(error)
    }
  }
}

SelectResources.description = 'Select resources for compile / migrate / test'
module.exports = SelectResources
