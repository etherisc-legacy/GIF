pragma solidity 0.5.2;

import "../modules/license/ILicenseController.sol";
import "../modules/access/IAccessController.sol";
import "../modules/registry/IRegistryController.v1.sol";
import "../modules/query/IQueryController.sol";
import "../shared/WithRegistry.sol";

contract DAOService is WithRegistry {
    bytes32 public constant NAME = "DAO";

    constructor(address _registry) public WithRegistry(_registry) {}

    /* License */
    function approveRegistration(uint256 _registrationId)
        external
        returns (uint256 _insuranceProductId)
    {
        _insuranceProductId = license().approveRegistration(_registrationId);
    }

    function declineRegistration(uint256 _registrationId) external {
        license().declineRegistration(_registrationId);
    }

    function disapproveInsuranceProduct(uint256 _insuranceProductId) external {
        license().disapproveInsuranceProduct(_insuranceProductId);
    }

    function reapproveInsuranceProduct(uint256 _insuranceProductId) external {
        license().reapproveInsuranceProduct(_insuranceProductId);
    }

    function pauseInsuranceProduct(uint256 _insuranceProductId) external {
        license().pauseInsuranceProduct(_insuranceProductId);
    }

    function unpauseInsuranceProduct(uint256 _insuranceProductId) external {
        license().unpauseInsuranceProduct(_insuranceProductId);
    }

    /* Access */
    function createRole(bytes32 _role) external {
        access().createRole(_role);
    }

    function addRoleToAccount(address _address, bytes32 _role) external {
        access().addRoleToAccount(_address, _role);
    }

    function cleanRolesForAccount(address _address) external {
        access().cleanRolesForAccount(_address);
    }

    /* Registry */
    function registerInRelease(
        uint256 _release,
        bytes32 _contractName,
        address _contractAddress
    ) external {
        registryStorage().registerInRelease(
            _release,
            _contractName,
            _contractAddress
        );
    }

    function register(bytes32 _contractName, address _contractAddress)
        external
    {
        registryStorage().register(_contractName, _contractAddress);
    }

    function deregisterInRelease(uint256 _release, bytes32 _contractName)
        external
    {
        registryStorage().deregisterInRelease(_release, _contractName);
    }

    function deregister(bytes32 _contractName) external {
        registryStorage().deregister(_contractName);
    }

    function prepareRelease() external returns (uint256 _release) {
        _release = registryStorage().prepareRelease();
    }

    /* Query */
    function activateOracleType(bytes32 _oracleTypeName) external {
        query().activateOracleType(_oracleTypeName);
    }

    function activateOracle(uint256 _oracleId) external {
        query().activateOracle(_oracleId);
    }

    /* Lookup */
    function license() internal view returns (ILicenseController) {
        return ILicenseController(registry.getContract("License"));
    }

    function access() internal view returns (IAccessController) {
        return IAccessController(registry.getContract("Access"));
    }

    function registryStorage() internal view returns (IRegistryController) {
        return IRegistryController(registry.getContract("Registry"));
    }

    function query() internal view returns (IQueryController) {
        return IQueryController(registry.getContract("Query"));
    }
}
