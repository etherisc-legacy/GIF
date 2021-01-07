const Migrations = artifacts.require('./Migrations.sol');
const progress = require('../bin/lib/progress');


module.exports = progress([], ['Initial migration'], async (deployer, networks, accounts) => {
  deployer.deploy(Migrations, { gas: 300000 });
});
