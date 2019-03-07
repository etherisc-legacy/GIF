const { Command } = require('@oclif/command');

/**
 * Logout command
 */
class Logout extends Command {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    this.log('Logout');
  }
}

Logout.description = `Logout from GIF
...
Logout from GIF
`;

module.exports = Logout;
