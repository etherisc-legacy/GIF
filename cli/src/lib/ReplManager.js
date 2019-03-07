const EventEmitter = require('events');
const vm = require('vm');
const repl = require('repl');

/**
 * REPL manager
 */
class ReplManager extends EventEmitter {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.start = this.start.bind(this);
  }

  /**
   * Set REPL context
   * @param {{}} obj
   */
  setContext(obj) {
    if (this.repl) {
      Object.keys(obj || {})
        .forEach(key => this.repl.context[key] = obj[key]);
    }
  }

  /**
   * Start REPL
   */
  start() {
    if (!this.repl) {
      this.repl = repl.start({
        prompt: 'GIF >  ',
        eval: this.interpret.bind(this),
        useColors: true,
      });
    }
  }

  /**
   * Interpret REPL command
   * @param {*} cmd
   * @param {*} context
   * @param {*} filename
   * @param {*} callback
   * @return {*}
   */
  interpret(cmd, context, filename, callback) {
    // Using: https://github.com/trufflesuite/truffle/blob/develop/packages/truffle-core/lib/console.js
    /*
    - allow whitespace before everything else
    - optionally capture `var|let|const <varname> = `
      - varname only matches if it starts with a-Z or _ or $
        and if contains only those chars or numbers
      - this is overly restrictive but is easier to maintain
    - capture `await <anything that follows it>`
    */
    const re = /^\s*((?:(?:var|const|let)\s+)?[a-zA-Z_$][0-9a-zA-Z_$]*\s*=\s*)?(\(?\s*await[\s\S]*)/;
    const match = cmd.match(re);

    let source = cmd;
    let assignment = null;

    if (match) {
      const assign = match[1];
      const expression = match[2];

      const RESULT = '__await_outside_result';

      // Wrap the await inside an async function.
      // Strange indentation keeps column offset correct in stack traces
      source = `(async function() { try { ${assign ? `global.${RESULT} =` : 'return'} (
${expression.trim()}
); } catch(e) { global.ERROR = e; throw e; } }())`;

      assignment = assign
        ? `${assign.trim()} global.${RESULT}; void delete global.${RESULT};`
        : null;
    }

    /**
     * Run script in content
     * @param {*} s
     * @return {*}
     */
    const runScript = (s) => {
      const options = { displayErrors: true, breakOnSigint: true, filename };
      return s.runInContext(context, options);
    };

    let script;
    try {
      const options = { displayErrors: true, lineOffset: -1 };
      script = vm.createScript(source, options);
    } catch (error) {
      // If syntax error, or similar, bail.
      return callback(error);
    }

    // Ensure our script returns a promise whether we're using an
    // async function or not. If our script is an async function,
    // this will ensure the console waits until that await is finished.
    return Promise.resolve(runScript(script))
      .then((value) => {
        // If there's an assignment to run, run that.
        if (assignment) {
          return runScript(vm.createScript(assignment));
        }

        return value;
      })
      .then((value) => {
        // All good? Return the value (e.g., eval'd script or assignment)
        callback(null, value);
      })
      .catch(callback);
  }
}

module.exports = ReplManager;
