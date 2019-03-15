const BaseCommand = require('../../lib/BaseCommand');

/**
 * Logout command
 */
class Logout extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    this.configure({});

    this.log('Logged out');
  }
}

Logout.description = `Logout from GIF
...
Logout from GIF
`;

module.exports = Logout;
