pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IAccessController.sol";
import "./AccessStorageModel.sol";
import "../../shared/ModuleController.sol";

contract AccessController is IAccessController, AccessStorageModel, ModuleController {
    bytes32 public constant NAME = "AccessController";

    constructor(address _registry) WithRegistry(_registry) {}

    function createRole(bytes32 _role) external override onlyInstanceOperator {
        require(roles[_role] == 0);

        roles[_role] = 1 << rolesKeys.length;
        rolesKeys.push(_role);
    }

    function addRoleToAccount(address _address, bytes32 _role)
        external override
        onlyInstanceOperator
    {
        require(roles[_role] != 0);

        permissions[_address] = permissions[_address] | roles[_role];
    }

    function cleanRolesForAccount(address _address)
        external override
        onlyInstanceOperator
    {
        delete permissions[_address];
    }

    function hasRole(address _address, bytes32 _role)
        external override
        view
        returns (bool _hasRole)
    {
        _hasRole = (permissions[_address] & roles[_role]) > 0;
    }
}
