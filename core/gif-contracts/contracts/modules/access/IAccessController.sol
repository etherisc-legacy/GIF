pragma solidity 0.5.2;

interface IAccessController {
    function createRole(bytes32 _role) external;

    function addRoleToAccount(address _address, bytes32 _role) external;

    function cleanRolesForAccount(address _address) external;

    function hasRole(address _address, bytes32 _role)
        external
        view
        returns (bool _hasRole);
}
