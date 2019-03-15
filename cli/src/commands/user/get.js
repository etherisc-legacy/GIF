const BaseCommand = require('../../lib/BaseCommand');

/**
 * Get current user
 */
class GetUser extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    //
  }
}

GetUser.description = `Get current user
...
Get user
`;

module.exports = GetUser;
