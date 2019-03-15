const { flags } = require('@oclif/command');
const BaseCommand = require('../../lib/BaseCommand');

/**
 * List oracles
 */
class ListOracles extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    const { flags: { limit, offset } } = this.parse(ListOracles);

    this.log(`Retrieve ${limit} customers from ${offset}`);
  }
}

ListOracles.flags = {
  limit: flags.string({ char: 'l', description: 'records offset', default: 20 }),
  offset: flags.string({ char: 'o', description: 'records limit', default: 0 }),
};

ListOracles.description = `List oracles
...
List oracles
`;

module.exports = ListOracles;
