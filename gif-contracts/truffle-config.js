require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { settings } = require('./package');


const hdWalletConfig = {
  mnemonic: process.env.MNEMONIC,
  providerOrUrl: process.env.HTTP_PROVIDER,
};

/* eslint-disable no-console */
console.log(`Deploying to Network ID = ${process.env.TRUFFLE_NETWORK_ID}`);
console.log(`Truffle host = ${process.env.TRUFFLE_HOST}:${process.env.TRUFFLE_PORT}`);


module.exports = {
  migrations_directory: process.env.MIGRATIONS_DIRECTORY || './migrations',
  contracts_build_directory: process.env.CONTRACTS_BUILD_DIRECTORY || './build',

  networks: {

    development: {
      provider: () => new HDWalletProvider(hdWalletConfig),
      host: process.env.TRUFFLE_HOST,
      port: process.env.TRUFFLE_PORT,
      network_id: process.env.TRUFFLE_NETWORK_ID,
      gas: process.env.TRUFFLE_GAS,
      gasPrice: process.env.TRUFFLE_GASPRICE,
      websockets: process.env.TRUFFLE_WEBSOCKETS,
      skipDryRun: true,
    },

    xdai: {
      provider: () => new HDWalletProvider(hdWalletConfig),
      host: process.env.TRUFFLE_HOST,
      port: process.env.TRUFFLE_PORT,
      network_id: process.env.TRUFFLE_NETWORK_ID,
      gas: process.env.TRUFFLE_GAS,
      gasPrice: process.env.TRUFFLE_GASPRICE,
      websockets: process.env.TRUFFLE_WEBSOCKETS,
      skipDryRun: true,
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
        evmVersion: 'byzantium', // -> constantinople
        evmTarget: 'byzantium', // -> constantinople, hack for truffle-source-verify
      },
    },
  },

  plugins: ['truffle-source-verify'],

};
