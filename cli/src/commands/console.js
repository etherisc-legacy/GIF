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
        gif: this.gif,
        eth: this.eth,
        moment: this.moment,
        clear: () => process.stdout.write('\u001b[2J\u001b[0;0H'),
      });
    });
  }
}

Console.description = `Run console mode
...
Run console mode
`;

module.exports = Console;
