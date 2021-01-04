const { settings } = require(`${process.cwd()}/package`);
const { Command } = require('@oclif/command');
const fs = require('fs-jetpack');
const crypto = require('crypto');

/**
 * Set solc compiler version
 */
class UpdateSolcVersion extends Command {
  /**
   * Get required version and update smart contracts files
   */
  run() {
    fs.find('contracts', { matching: '*.sol' })
      .forEach((contract) => {
        const input = fs.read(contract, 'utf8');
        const inputHash = crypto.createHash('md5').update(input).digest('hex');

        const output = input.replace(/pragma solidity +.*;/, `pragma solidity ${settings.solc};`);
        const outputHash = crypto.createHash('md5').update(output).digest('hex');

        if (inputHash !== outputHash) {
          fs.write(contract, output);
          console.log(`Solc compiler version in contract ${contract} has been changed to ${settings.solc}`);
        }
      });
  }
}

UpdateSolcVersion.description = 'Set solc compiler version in smart contracts. Version should be specified in package.json';

module.exports = UpdateSolcVersion;
