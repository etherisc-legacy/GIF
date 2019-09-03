const BaseCommand = require('../lib/BaseCommand');

/**
 * Print version
 */
class Version extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    // placeholder for default command
  }
}

Version.description = `print version
...
Print version
`;

module.exports = Version;
