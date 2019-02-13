pragma solidity 0.5.2;

import "../shared/WithRegistry.sol";
import "../modules/license/ILicenseController.sol";
import "../modules/registry/IRegistryController.v1.sol";


contract DAOService is WithRegistry {

    bytes32 public constant NAME = "DAO";

    constructor(address _registry) public WithRegistry(_registry) {}

    /* License */
    function approveRegistration(uint256 _registrationId) external returns (uint256 _applicationId) {
        _applicationId = license().approveRegistration(_registrationId);
    }

    function declineRegistration(uint256 _registrationId) external {
        license().declineRegistration(_registrationId);
    }

    function disapproveInsuranceApplication(uint256 _applicationId) external {
        license().disapproveInsuranceApplication(_applicationId);
    }

    function reapproveInsuranceApplication(uint256 _applicationId) external {
        license().reapproveInsuranceApplication(_applicationId);
    }

    function pauseInsuranceApplication(uint256 _applicationId) external {
        license().pauseInsuranceApplication(_applicationId);
    }

    function unpauseInsuranceApplication(uint256 _applicationId) external {
        license().unpauseInsuranceApplication(_applicationId);
    }

    /* Registry */
    function registerInRelease(uint256 _release, bytes32 _contractName, address _contractAddress) external {
        registryStorage().registerInRelease(_release, _contractName, _contractAddress);
    }

    function register(bytes32 _contractName, address _contractAddress) external {
        registryStorage().register(_contractName, _contractAddress);
    }

    function deregisterInRelease(uint256 _release, bytes32 _contractName) external {
        registryStorage().deregisterInRelease(_release, _contractName);
    }

    function deregister(bytes32 _contractName) external {
        registryStorage().deregister(_contractName);
    }

    function prepareRelease() external returns (uint256 _release) {
        _release = registryStorage().prepareRelease();
    }

    /* Lookup */
    function license() internal view returns (ILicenseController) {
        return ILicenseController(registry.getContract("License"));
    }

    function registryStorage() internal view returns (IRegistryController) {
        return IRegistryController(registry.getContract("Registry"));
    }
}
