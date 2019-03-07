const { Command } = require('@oclif/command');

/**
 * Send artifacts command
 */
class SendArtifacts extends Command {
  /**
   * Run command
   * @return {Promise<void>}
   */
  async run() {
    //
  }
}

SendArtifacts.description = `Send artifacts into GIF
...
Send artifacts into GIF
`;

module.exports = SendArtifacts;
