pragma solidity 0.6.11;
// SPDX-License-Identifier: Apache-2.0

import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract RBAC is Ownable {
    mapping(bytes32 => uint256) public roles;
    bytes32[] public rolesKeys;

    mapping(address => uint256) public permissions;

    modifier onlyWithRole(bytes32 _role) {
        require(hasRole(msg.sender, _role));
        _;
    }

    function createRole(bytes32 _role) public onlyOwner {
        require(roles[_role] == 0);
        // todo: check overflow
        roles[_role] = 1 << rolesKeys.length;
        rolesKeys.push(_role);
    }

    function addRoleToAccount(address _address, bytes32 _role) public onlyOwner {
        require(roles[_role] != 0);

        permissions[_address] = permissions[_address] | roles[_role];
    }

    function cleanRolesForAccount(address _address) public onlyOwner {
        delete permissions[_address];
    }

    function hasRole(address _address, bytes32 _role)
        public
        view
        returns (bool _hasRole)
    {
        _hasRole = (permissions[_address] & roles[_role]) > 0;
    }
}
