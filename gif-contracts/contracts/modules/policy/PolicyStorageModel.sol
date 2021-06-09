pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IPolicy.sol";

contract PolicyStorageModel is IPolicy {
    // Metadata
    mapping(bytes32 => Metadata) public metadata;

    // Applications
    mapping(bytes32 => Application) public applications;

    // Policies
    mapping(bytes32 => Policy) public policies;

    // Claims
    mapping(bytes32 => mapping (uint256 => Claim)) public claims;

    // Payouts
    mapping(uint256 => mapping (uint256 => Payout)) public payouts;
}
