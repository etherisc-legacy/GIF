const { Command, flags } = require('@oclif/command');
const fs = require('fs');
const vm = require('vm');
const Module = require('module');
const Gif = require('../lib/Gif');

/**
 * Exec script file command
 */
class Exec extends Command {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    const { flags: { file } } = this.parse(Exec);

    const code = fs.readFileSync(file);
    const mod = new Module(file);

    const context = {
      module: mod,
      require: mod.require,
      console,
      gif: new Gif(),
    };

    const script = vm.createScript(code.toString('utf8'), { filename: file });
    script.runInNewContext(context);
  }
}

Exec.description = `Execute file
...
Execute file
`;

Exec.flags = {
  file: flags.string({ char: 'f', description: 'file to execute', required: true }),
};

module.exports = Exec;
