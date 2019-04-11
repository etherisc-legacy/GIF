pragma solidity 0.5.2;

import "./IPolicy.sol";

contract PolicyStorageModel is IPolicy {
    // Metadata
    mapping(uint256 => mapping(uint256 => Metadata)) public metadata;
    uint256 public metadataIdIncrement;

    // Applications
    mapping(uint256 => mapping(uint256 => Application)) public applications;
    uint256 public applicationIdIncrement;

    // Policies
    mapping(uint256 => mapping(uint256 => Policy)) public policies;
    uint256 public policyIdIncrement;

    // Claims
    mapping(uint256 => mapping(uint256 => Claim)) public claims;
    uint256 public claimIdIncrement;

    // Payouts
    mapping(uint256 => mapping(uint256 => Payout)) public payouts;
    uint256 public payoutIdIncrement;
}
