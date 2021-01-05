require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });
const { bootstrap } = require('@etherisc/microservice');
const { Command } = require('@oclif/command');
const PublishContracts = require('../lib/PublishContracts');
const pkg = require('../../package.json');

/**
 * Publish GIF core contracts to microservices
 */
class Broadcast extends Command {
  /**
   * Get required version and update smart contracts files
   */
  run() {
    bootstrap(PublishContracts, {
      amqp: true,
      appName: pkg.name,
      appVersion: pkg.version,
      requiredEnv: [],
    });
  }
}

Broadcast.description = 'Publish GIF core contracts to microservices';

module.exports = Broadcast;
