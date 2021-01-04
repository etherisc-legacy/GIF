const truffleConfig = require('./truffle-config');


const port = truffleConfig.networks.coverage.port;

const testrpcOptions = `-p ${port} `
  + `--account="0x${'1'.padStart(64, '0')},${'1'.padEnd(24, '0')}", `
  + `--account="0x${'2'.padStart(64, '0')},${'1'.padEnd(24, '0')}", `
  + `--account="0x${'3'.padStart(64, '0')},${'1'.padEnd(24, '0')}", `
  + `--account="0x${'4'.padStart(64, '0')},${'1'.padEnd(24, '0')}", `
  + `--account="0x${'5'.padStart(64, '0')},${'1'.padEnd(24, '0')}", `
  + `--account="0x${'6'.padStart(64, '0')},${'1'.padEnd(24, '0')}", `
  + `--account="0x${'7'.padStart(64, '0')},${'1'.padEnd(24, '0')}", `
  + `--account="0x${'8'.padStart(64, '0')},${'1'.padEnd(24, '0')}", `
  + `--account="0x${'9'.padStart(64, '0')},${'1'.padEnd(24, '0')}"`;

module.exports = {
  port,
  testrpcOptions,
  testCommand: 'npm run test -- --network coverage',
  copyNodeModules: false,
  copyPackages: ['zeppelin-solidity'],
  reporter: ['html', 'lcov', 'text', 'json-summary'],  // https://github.com/sc-forks/solidity-coverage/pull/308
};
