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
      host: 'dip-rpc-node',
      port: 8545,
      network_id: '4447',
      gas: 8000000,
      gasPrice: 10 * 1000000000,
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
