pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IStake.sol";

contract StakeStorageModel is IStake {
    // Metadata
    mapping(bytes32 => Metadata) public metadata;

    // Applications
    mapping(bytes32 => Application) public applications;

    // Policies
    mapping(bytes32 => Stake) public stakes;

    // Claims
    mapping(bytes32 => mapping(uint256 => Claim)) public claims;

    // Payouts
    mapping(bytes32 => mapping(uint256 => Payout)) public payouts;

    bytes32[] public bpKeys;
}
