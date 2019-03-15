const BaseCommand = require('../../lib/BaseCommand');

/**
 * Create oracle command
 */
class CreateOracle extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    //
  }
}

CreateOracle.description = `Create new oracle
...
Create new oracle
`;

module.exports = CreateOracle;
