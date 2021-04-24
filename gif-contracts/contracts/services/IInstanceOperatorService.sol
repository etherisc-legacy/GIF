pragma solidity 0.8.0;

// SPDX-License-Identifier: Apache-2.0

interface IInstanceOperatorService {
    function assignController(address _storage, address _controller) external;

    function assingStorage(address _controller, address _storage) external;

    // License
    function approveProduct(uint256 _productId) external;

    function disapproveProduct(uint256 _productId) external;

    function pauseProduct(uint256 _productId) external;

    function unpauseProduct(uint256 _productId) external;

    // Access
    function createRole(bytes32 _role) external;

    function addRoleToAccount(address _address, bytes32 _role) external;

    function cleanRolesForAccount(address _address) external;

    // Registry
    function registerInRelease(
        uint256 _release,
        bytes32 _contractName,
        address _contractAddress
    ) external;

    function register(bytes32 _contractName, address _contractAddress) external;

    function deregisterInRelease(uint256 _release, bytes32 _contractName)
        external;

    function deregister(bytes32 _contractName) external;

    function prepareRelease() external returns (uint256 _release);

    function registerService(bytes32 _name, address _addr) external;

    // Query
    function activateOracleType(bytes32 _oracleTypeName) external;

    function activateOracle(uint256 _oracleId) external;

    function assignOracleToOracleType(
        bytes32 _oracleTypeName,
        uint256 _oracleId
    ) external;
}
