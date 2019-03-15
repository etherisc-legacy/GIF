const BaseCommand = require('../../lib/BaseCommand');

/**
 * List core contracts
 */
class ListContracts extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    //
  }
}

ListContracts.description = `List core contracts
...
List contracts
`;

module.exports = ListContracts;
