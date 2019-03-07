const { Command } = require('@oclif/command');
const ReplManager = require('../lib/ReplManager');
const Gif = require('../lib/Gif');

/**
 * Start console command
 */
class Console extends Command {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    const repl = new ReplManager();
    repl.start();
    repl.setContext({
      gif: new Gif(),
    });
  }
}

Console.description = `Run console mode
...
Run console mode
`;

module.exports = Console;
