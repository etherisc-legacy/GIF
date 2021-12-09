// eslint-disable-next-line no-console
const info = console.log

const InstanceOperatorService = artifacts.require('gif-services/InstanceOperatorService.sol')

module.exports = async (deployer, network, accounts) => {
  const instanceOperator = await InstanceOperatorService.deployed()

  info('Register Sandbox account')
  await instanceOperator.register(web3.utils.toHex('Sandbox'), accounts[0])
    .on('transactionHash', (txHash) => info(`transaction hash: ${txHash}`))
}
