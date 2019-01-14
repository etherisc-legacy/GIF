const HDWalletProvider = require('truffle-hdwallet-provider');


module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '4447',
      gas: 8000000,
      gasPrice: 10 * 1000000000,
    },
    dip_rpc: {
      host: 'ganache',
      port: 8545,
      network_id: '4448',
      gas: 8000000,
      gasPrice: 10 * 1000000000,
    },
    kovan: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.HTTP_PROVIDER),
      network_id: 42,
      gas: 5500000,
      confirmation: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  solc: {
    version: '0.5.1',
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
