pragma solidity 0.5.2;

import "./IRegistry.sol";

contract RegistryStorageModel is IRegistry {
    /**
     * @dev Current release
     */
    uint256 public release;

    /**
     * @dev  Save number of items to iterate through
     */
    uint256 public maxContracts = 100;

    // release => contract name => contract address
    mapping(uint256 => mapping(bytes32 => address)) public contracts;
    // release => contract name []
    mapping(uint256 => bytes32[]) public contractNames;
    // controller name => address
    mapping(bytes32 => address) public controllers;
}
