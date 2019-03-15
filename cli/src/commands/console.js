const BaseCommand = require('../lib/BaseCommand');
const ReplManager = require('../lib/ReplManager');

/**
 * Start console command
 */
class Console extends BaseCommand {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    const replManager = new ReplManager();

    await new Promise((resolve) => {
      replManager.start();
      replManager.repl.on('exit', resolve);
      replManager.setContext({
        gif: this.gif.cli,
      });
    });
  }
}

Console.description = `Run console mode
...
Run console mode
`;

module.exports = Console;
