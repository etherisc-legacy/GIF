pragma solidity 0.5.2;

import "./IAccess.sol";

contract AccessStorageModel is IAccess {
    mapping(bytes32 => uint256) public roles;
    bytes32[] public rolesKeys;

    mapping(address => uint256) public permissions;
}
