pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IAccess.sol";

contract AccessStorageModel is IAccess {
    mapping(bytes32 => uint256) public roles;
    bytes32[] public rolesKeys;

    mapping(address => uint256) public permissions;
}
