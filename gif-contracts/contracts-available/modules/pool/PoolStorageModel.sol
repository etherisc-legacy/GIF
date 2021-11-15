// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.0;

import "./IPool.sol";

contract PoolStorageModel is IPool {

    mapping(uint256 => Pool) public pools;
    mapping(address => uint256) public poolIdByAddress;
    uint256 public poolCount;

}
