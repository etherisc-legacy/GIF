const { Command, flags } = require('@oclif/command')
const { verifyBlockscout } = require('truffle-source-verify/lib')
const { verifyEtherscan } = require('truffle-plugin-verify/lib')
// eslint-disable-next-line no-console
/**
 * Publish GIF core contracts to microservices
 */
class Verify extends Command {
  /**
   * Get required version and update smart contracts files
   */
  static flags = {
    contract: flags.string({
      char: 'c',
      default: 'core',
      required: true,
    }),
    network: flags.string({
      char: 'c',
      default: 'xdai',
      required: false,
    }),
    license: flags.string({
      char: 'l',
      default: 'Apache-2.0',
      required: false,
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

    const { contract, license, network } = flags
    const contracts = contract === 'core' ? coreContracts : [contract]

    if (['xdai', 'sokol'].includes(network.toLower())) {
      await verifyBlockscout(contracts, network, license)
    } else {
      await verifyEtherscan(contracts, network, license)
    }
  }
}

Verify.description = 'Prepare verification of contracts'

module.exports = Verify
