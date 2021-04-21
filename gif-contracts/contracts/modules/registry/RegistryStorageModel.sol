pragma solidity 0.6.11;
// SPDX-License-Identifier: Apache-2.0

import "./IRegistry.sol";

contract RegistryStorageModel is IRegistry {
    /**
     * @dev Current release
     * We use semantic versioning with 2 digits:
     * 1.0.0 = 10000; 1.0.1 = 10001; 1.5.3 = 10503 etc
     */
    uint256 public release = 10000;

    /**
     * @dev  Save number of items to iterate through
     * Currently we have < 20 contracts.
     */
    uint256 public maxContracts = 100;

    // release => contract name => contract address
    mapping(uint256 => mapping(bytes32 => address)) public contracts;
    // release => contract name []
    mapping(uint256 => bytes32[]) public contractNames;
    // controller name => address
    mapping(bytes32 => address) public controllers;
}
