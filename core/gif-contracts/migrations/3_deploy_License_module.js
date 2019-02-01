const Registry = artifacts.require('modules/registry/Registry.sol');
const RegistryController = artifacts.require('modules/registry/RegistryController.sol');
const License = artifacts.require('modules/license/License.sol');
const LicenseController = artifacts.require('modules/license/LicenseController.sol');


module.exports = async (deployer) => {
  const registryStorage = await Registry.deployed();
  const registry = await RegistryController.at(registryStorage.address);

  // Deploy storage and controller contracts
  await deployer.deploy(License, registryStorage.address);
  await deployer.deploy(LicenseController, registryStorage.address);

  const licenseStorage = await License.deployed();
  const licenseController = await LicenseController.deployed();

  // Bind storage & controller contracts
  await licenseStorage.assignController(licenseController.address);
  await licenseController.assignStorage(licenseStorage.address);

  // Register License module in Registry
  const licenseStorageName = await licenseStorage.NAME.call();
  await registry.register(licenseStorageName, licenseStorage.address);
};
