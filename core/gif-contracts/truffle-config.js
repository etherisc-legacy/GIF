const { settings } = require(`${process.cwd()}/package`);
const HDWalletProvider = require('truffle-hdwallet-provider');


module.exports = {
  migrations_directory: process.env.MIGRATIONS_DIRECTORY || './migrations',
  contracts_build_directory: process.env.CONTRACTS_BUILD_DIRECTORY || './build',

  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '4444',
      gas: 8000000,
      gasPrice: 10 * (10 ** 9),
    },

    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8555, // the same port as in .solcover.js.
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },

    kovan: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.HTTP_PROVIDER),
      network_id: 42,
      confirmation: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 10 * (10 ** 9),
    },
  },

  mocha: {
    timeout: 20000,
    useColors: true,
  },

  compilers: {
    solc: {
      version: settings.solc,
      settings: {
        optimizer: {
          enabled: false,
          runs: 200,
        },
        evmVersion: 'byzantium', // -> constantinople
      },
    },
  },
};
