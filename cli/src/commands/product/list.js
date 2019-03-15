const { flags } = require('@oclif/command');
const BaseCommand = require('../../lib/BaseCommand');

/**
 * List products
 */
class ListProducts extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    const { flags: { limit, offset } } = this.parse(ListProducts);

    this.log(`Retrieve ${limit} customers from ${offset}`);
  }
}

ListProducts.flags = {
  limit: flags.string({ char: 'l', description: 'records offset', default: 20 }),
  offset: flags.string({ char: 'o', description: 'records limit', default: 0 }),
};

ListProducts.description = `List products
...
List products
`;

module.exports = ListProducts;
