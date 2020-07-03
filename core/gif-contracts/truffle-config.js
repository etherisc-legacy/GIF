const HDWalletProvider = require('@truffle/hdwallet-provider');
const { settings } = require('./package');


module.exports = {
  migrations_directory: process.env.MIGRATIONS_DIRECTORY || './migrations',
  contracts_build_directory: process.env.CONTRACTS_BUILD_DIRECTORY || './build',

  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: 7777,
      gas: 6600000,
      gasPrice: 10 * (10 ** 9),
      websockets: true,
    },

    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8555, // the same port as in .solcover.js.
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },

    kovan: {
      // MNEMONIC: BIP39 mnemonic, e.g. https://iancoleman.io/bip39/#english
      // HTTP_PRODIVER: e.g. https://kovan.infura.io/<your-token>
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.HTTP_PROVIDER),
      network_id: 42,
      confirmation: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 6600000,
      gasPrice: 10 * (10 ** 9),
    },

    rinkeby: {
      // MNEMONIC: BIP39 mnemonic, e.g. https://iancoleman.io/bip39/#english
      // HTTP_PRODIVER: e.g. https://rinkeby.infura.io/<your-token>
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.HTTP_PROVIDER),
      network_id: 4,
      confirmation: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 6600000,
      gasPrice: 10 * (10 ** 9),
    },
  },

  mocha: {
    timeout: 30000,
    useColors: true,
  },

  compilers: {
    solc: {
      version: settings.solc,
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        evmVersion: 'byzantium', // -> constantinople
      },
    },
  },
};
