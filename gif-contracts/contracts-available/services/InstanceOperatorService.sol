pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "../modules/license/ILicenseController.sol";
import "../modules/access/IAccessController.sol";
import "../modules/registry/IRegistryController.sol";
import "../modules/query/IQueryController.sol";
import "../shared/WithRegistry.sol";
import "../shared/IModuleController.sol";
import "../shared/IModuleStorage.sol";
import "./IInstanceOperatorService.sol";

contract InstanceOperatorService is IInstanceOperatorService, WithRegistry, Ownable {
    bytes32 public constant NAME = "InstanceOperatorService";

    // solhint-disable-next-line no-empty-blocks
    constructor(address _registry) WithRegistry(_registry) {}

    function assignController(address _storage, address _controller)
        external override
        onlyOwner
    {
        IModuleStorage(_storage).assignController(_controller);
    }

    function assignStorage(address _controller, address _storage)
        external override
        onlyOwner
    {
        IModuleController(_controller).assignStorage(_storage);
    }

    /* License */
    function approveProduct(uint256 _productId) external override {
        license().approveProduct(_productId);
    }

    function disapproveProduct(uint256 _productId) external override {
        license().disapproveProduct(_productId);
    }

    function pauseProduct(uint256 _productId) external override {
        license().pauseProduct(_productId);
    }

    /* Access */
    function createRole(bytes32 _role) external override onlyOwner {
        access().createRole(_role);
    }

    function addRoleToAccount(address _address, bytes32 _role)
        external override
        onlyOwner
    {
        access().addRoleToAccount(_address, _role);
    }

    function cleanRolesForAccount(address _address) external override onlyOwner {
        access().cleanRolesForAccount(_address);
    }

    /* Registry */
    function registerInRelease(
        bytes32 _release,
        bytes32 _contractName,
        address _contractAddress
    ) external override onlyOwner {
        registry.registerInRelease(_release, _contractName, _contractAddress);
    }

    function register(bytes32 _contractName, address _contractAddress)
        external override
        onlyOwner
    {
        registry.register(_contractName, _contractAddress);
    }

    function deregisterInRelease(bytes32 _release, bytes32 _contractName)
        external override
        onlyOwner
    {
        registry.deregisterInRelease(_release, _contractName);
    }

    function deregister(bytes32 _contractName) external override onlyOwner {
        registry.deregister(_contractName);
    }

    function prepareRelease(bytes32 _newRelease) external override onlyOwner {
        registry.prepareRelease(_newRelease);
    }

    /* Query */
    function approveOracleType(bytes32 _oracleTypeName) external override onlyOwner {
        query().approveOracleType(_oracleTypeName);
    }

    function disapproveOracleType(bytes32 _oracleTypeName) external override onlyOwner {
        query().disapproveOracleType(_oracleTypeName);
    }

    function approveOracle(uint256 _oracleId) external override onlyOwner {
        query().approveOracle(_oracleId);
    }

    function disapproveOracle(uint256 _oracleId) external override onlyOwner {
        query().disapproveOracle(_oracleId);
    }

    function assignOracleToOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external override onlyOwner {
        query().assignOracleToOracleType(_oracleTypeName, _oracleId);
    }

    /* Lookup */
    function license() internal view returns (ILicenseController) {
        return ILicenseController(registry.getContract("License"));
    }

    function access() internal view returns (IAccessController) {
        return IAccessController(registry.getContract("Access"));
    }

    function query() internal view returns (IQueryController) {
        return IQueryController(registry.getContract("Query"));
    }
}
