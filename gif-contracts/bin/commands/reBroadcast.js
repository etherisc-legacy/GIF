const { Command } = require('@oclif/command');
const { bootstrap } = require('@etherisc/microservice');
const RePublishContracts = require('../lib/RePublishContracts');
const pkg = require('../../package.json');


/**
 * Rebroadcast GIF core contracts
 */
class ReBroadcast extends Command {
  /**
   * Run the command
   */
  run() {
    bootstrap(RePublishContracts, {
      amqp: true,
      appName: pkg.name,
      appVersion: pkg.version,
      requiredEnv: [],
    });
  }
}

ReBroadcast.description = 'Republish GIF core contracts to microservices';

module.exports = ReBroadcast;
