pragma solidity 0.8.0;

// SPDX-License-Identifier: Apache-2.0

interface IAccessController {
    function createRole(bytes32 _role) external;

    function addRoleToAccount(address _address, bytes32 _role) external;

    function cleanRolesForAccount(address _address) external;

    function hasRole(address _address, bytes32 _role)
        external
        view
        returns (bool _hasRole);
}
