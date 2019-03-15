const BaseCommand = require('../../lib/BaseCommand');

/**
 * Send artifacts command
 */
class SendArtifacts extends BaseCommand {
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
