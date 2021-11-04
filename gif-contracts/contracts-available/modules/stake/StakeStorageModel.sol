pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IStake.sol";

contract StakeStorageModel is IStake {
    // Metadata
    mapping(bytes32 => Metadata) public metadata;

    // Stakes
    mapping(bytes32 => Stake) public stakes;

    bytes32[] public bpKeys;
}
