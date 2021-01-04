const Migrations = artifacts.require('./Migrations.sol');


module.exports = deployer => deployer.deploy(Migrations, { gas: 300000 });
