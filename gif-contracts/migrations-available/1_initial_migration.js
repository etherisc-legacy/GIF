const Migrations = artifacts.require('./Migrations.sol')

module.exports = async (deployer) => {
  deployer.deploy(Migrations)
}
