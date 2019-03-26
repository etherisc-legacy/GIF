pragma solidity 0.5.2;

import "./AccessStorageModel.sol";
import "../../shared/ModuleController.sol";

contract AccessController is AccessStorageModel, ModuleController {
    constructor(address _registry) public WithRegistry(_registry) {}

    function createRole(bytes32 _role) external onlyInstanceOperator {
        require(roles[_role] == 0);

        roles[_role] = 1 << rolesKeys.length;
        rolesKeys.push(_role);
    }

    function addRoleToAccount(address _address, bytes32 _role)
        external
        onlyInstanceOperator
    {
        require(roles[_role] != 0);

        permissions[_address] = permissions[_address] | roles[_role];
    }

    function cleanRolesForAccount(address _address)
        external
        onlyInstanceOperator
    {
        delete permissions[_address];
    }

    function hasRole(address _address, bytes32 _role)
        external
        view
        returns (bool _hasRole)
    {
        _hasRole = (permissions[_address] & roles[_role]) > 0;
    }
}
