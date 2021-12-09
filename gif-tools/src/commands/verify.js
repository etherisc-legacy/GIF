const { Command, flags } = require('@oclif/command')
const { verify } = require('truffle-source-verify/lib')
// eslint-disable-next-line no-console
/**
 * Publish GIF core contracts-available-available to microservices
 */
class Verify extends Command {
  /**
   * Get required version and update smart contracts-available-available files
   */
  static flags = {
    contract: flags.string({
      char: 'c',
      default: 'core',
      required: true,
    }),
  }

  async run() {
    // eslint-disable-next-line no-shadow
    const { flags } = this.parse(Verify)
    const coreContracts = [
      'InstanceOperatorService',
      'Registry',
      'RegistryController',
      'License',
      'LicenseController',
      'Policy',
      'PolicyController',
      'Query',
      'QueryController',
      'ProductService',
      'OracleOwnerService',
      'OracleService',
      'PolicyFlowDefault',
    ]

    const contracts = flags.contract === 'core' ? coreContracts : [flags.contract]

    await verify(contracts,
      'xdai',
      'Apache-2.0')
  }
}

Verify.description = 'Prepare verification of contracts-available-available'

module.exports = Verify
