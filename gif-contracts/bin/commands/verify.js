const { exec } = require('child_process');
const { Command } = require('@oclif/command');

/**
 * Publish GIF core contracts to microservices
 */
class Verify extends Command {
  /**
   * Get required version and update smart contracts files
   */
  run() {
    exec('./bin/lib/prepare-verification.sh', (error, stdout, stderr) => {
      if (error) {
        console.log(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`Errors: ${stderr}`);
        return;
      }
      console.log(`Result: ${stdout}`);
    });
  }
}

Verify.description = 'Prepare verification of contracts';

module.exports = Verify;
