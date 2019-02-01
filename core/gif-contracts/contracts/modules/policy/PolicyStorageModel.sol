pragma solidity 0.5.2;

import "./IPolicy.sol";

contract PolicyStorageModel is IPolicy {
    mapping(uint256 => Metadata[]) public metadata;

    mapping(uint256 => Application[]) public applications;

    mapping(uint256 => Policy[]) public policies;

    mapping(uint256 => Claim[]) public claims;

    mapping(uint256 => Payout[]) public payouts;
}
