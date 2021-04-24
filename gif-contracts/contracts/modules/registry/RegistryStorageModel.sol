pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IRegistry.sol";

contract RegistryStorageModel is IRegistry {
    /**
     * @dev Current release
     * We use semantic versioning.
     */
    bytes32 public release;

    /**
     * @dev  Save number of items to iterate through
     * Currently we have < 20 contracts.
     */
    uint256 public maxContracts = 100;

    // release => contract name => contract address
    mapping(bytes32 => mapping(bytes32 => address)) public contracts;
    // release => contract name []
    mapping(bytes32 => bytes32[]) public contractNames;
    // number of contracts in release
    mapping(bytes32 => uint256) public contractsInRelease;
}
