pragma solidity 0.5.12;

import "./LicenseStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract License is LicenseStorageModel, ModuleStorage {
    bytes32 public constant NAME = "License";

    constructor(address _registry) public WithRegistry(_registry) {
        // Empty
    }
}
