const {exec} = require('child_process')
const {Command} = require('@oclif/command')
// eslint-disable-next-line no-console
const info = console.log
/**
 * Publish GIF core contracts-available to microservices
 */
class Verify extends Command {
  /**
   * Get required version and update smart contracts-available files
   */
  run() {
    exec('./bin/lib/prepare-verification.sh', (error, stdout, stderr) => {
      if (error) {
        info(`Error: ${error.message}`)
        return
      }
      if (stderr) {
        info(`Errors: ${stderr}`)
        return
      }
      info(`Result: ${stdout}`)
    })
  }
}

Verify.description = 'Prepare verification of contracts-available'

module.exports = Verify
