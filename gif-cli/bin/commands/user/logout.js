const BaseCommand = require('../../lib/BaseCommand');

/**
 * Logout
 */
class Logout extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    this.globalConfig.configure({});

    this.log('Logged out');
  }
}

Logout.description = `Logout
...
Logout
`;

module.exports = Logout;
