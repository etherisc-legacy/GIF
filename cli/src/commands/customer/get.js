const { Command, flags } = require('@oclif/command');

/**
 * Get customer
 */
class GetCustomer extends Command {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    const { flags: { id } } = this.parse(GetCustomer);

    this.log(`Retrieve customer by id: ${id}`);
  }
}

GetCustomer.flags = {
  id: flags.string({ char: 'i', description: 'customer id', required: true }),
};

GetCustomer.description = `Get customer
...
Get customer
`;

module.exports = GetCustomer;