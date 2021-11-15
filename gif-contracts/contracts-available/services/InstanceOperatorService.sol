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

contract InstanceOperatorService is WithRegistry, Ownable {
    bytes32 public constant NAME = "InstanceOperatorService";

    // solhint-disable-next-line no-empty-blocks
    constructor(address _registry) WithRegistry(_registry) {}

    function assignController(address _storage, address _controller)
        external
        onlyOwner
    {
        IModuleStorage(_storage).assignController(_controller);
    }

    function assignStorage(address _controller, address _storage)
        external
        onlyOwner
    {
        IModuleController(_controller).assignStorage(_storage);
    }

    /* License */
    function approveProduct(uint256 _productId) external {
        license().approveProduct(_productId);
    }

    function disapproveProduct(uint256 _productId) external {
        license().disapproveProduct(_productId);
    }

    function pauseProduct(uint256 _productId) external {
        license().pauseProduct(_productId);
    }

    /* Access */
    function createRole(bytes32 _role) external onlyOwner {
        access().createRole(_role);
    }

    function addRoleToAccount(address _address, bytes32 _role)
        external
        onlyOwner
    {
        access().addRoleToAccount(_address, _role);
    }

    function cleanRolesForAccount(address _address) external onlyOwner {
        access().cleanRolesForAccount(_address);
    }

    /* Registry */
    function registerInRelease(
        bytes32 _release,
        bytes32 _contractName,
        address _contractAddress
    ) external onlyOwner {
        registry.registerInRelease(_release, _contractName, _contractAddress);
    }

    function register(bytes32 _contractName, address _contractAddress)
        external
        onlyOwner
    {
        registry.register(_contractName, _contractAddress);
    }

    function deregisterInRelease(bytes32 _release, bytes32 _contractName)
        external
        onlyOwner
    {
        registry.deregisterInRelease(_release, _contractName);
    }

    function deregister(bytes32 _contractName) external onlyOwner {
        registry.deregister(_contractName);
    }

    function prepareRelease() external onlyOwner {
        registry.prepareRelease();
    }

    /* Query */
    function approveOracleType(bytes32 _oracleTypeName) external onlyOwner {
        query().approveOracleType(_oracleTypeName);
    }

    function disapproveOracleType(bytes32 _oracleTypeName) external onlyOwner {
        query().disapproveOracleType(_oracleTypeName);
    }

    function approveOracle(uint256 _oracleId) external onlyOwner {
        query().approveOracle(_oracleId);
    }

    function disapproveOracle(uint256 _oracleId) external onlyOwner {
        query().disapproveOracle(_oracleId);
    }

    function assignOracleToOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external onlyOwner {
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
