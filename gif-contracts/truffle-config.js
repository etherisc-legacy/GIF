require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')
const { settings } = require('./package')

const hdWalletConfig = {
  development: {
    mnemonic: process.env.DEV_MNEMONIC,
    providerOrUrl: process.env.DEV_HTTP_PROVIDER,
  },
  xdai: {
    mnemonic: process.env.XDAI_MNEMONIC,
    providerOrUrl: process.env.XDAI_HTTP_PROVIDER,
  },
  sokol: {
    mnemonic: process.env.SOKOL_MNEMONIC,
    providerOrUrl: process.env.SOKOL_HTTP_PROVIDER,
    pollingInterval: 200000,
  },
}

module.exports = {

  migrations_directory: process.env.MIGRATIONS_DIRECTORY || './migrations',
  contracts_build_directory: process.env.CONTRACTS_BUILD_DIRECTORY || './build',

  networks: {

    development: {
      provider: () => new HDWalletProvider(hdWalletConfig.development),
      host: process.env.DEV_HOST,
      port: process.env.DEV_PORT,
      network_id: process.env.DEV_NETWORK_ID,
      gas: process.env.GAS,
      gasPrice: process.env.GASPRICE,
      websockets: process.env.WEBSOCKETS,
      skipDryRun: true,
    },

    xdai: {
      provider: () => new HDWalletProvider(hdWalletConfig.xdai),
      host: process.env.XDAI_HOST,
      port: process.env.XDAI_PORT,
      network_id: process.env.XDAI_NETWORK_ID,
      gas: process.env.GAS,
      gasPrice: process.env.GASPRICE,
      websockets: process.env.WEBSOCKETS,
      skipDryRun: true,
    },

    polygon: {
      provider: () => new HDWalletProvider(hdWalletConfig.polygon),
      host: process.env.POLYGON_HOST,
      port: process.env.POLYGON_PORT,
      network_id: process.env.POLYGON_NETWORK_ID,
      gas: process.env.GAS,
      gasPrice: process.env.GASPRICE,
      websockets: process.env.WEBSOCKETS,
      skipDryRun: true,
    },

    sokol: {
      provider: () => new HDWalletProvider(hdWalletConfig.sokol),
      host: process.env.SOKOL_HOST,
      port: process.env.SOKOL_PORT,
      network_id: process.env.SOKOL_NETWORK_ID,
      gas: process.env.GAS,
      gasPrice: process.env.GASPRICE,
      websockets: process.env.WEBSOCKETS,
      skipDryRun: true,
      deploymentPollingInterval: 200000,
      networkCheckTimeout: 999999,
    },

    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8555, // the same port as in .solcover.js.
      gas: 0xfffffffffff,
      gasPrice: 0x01,
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
        evmVersion: 'istanbul',
      },
    },
  },

  plugins: ['truffle-source-verify'],

}
