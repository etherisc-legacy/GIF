pragma solidity 0.6.11;
// SPDX-License-Identifier: Apache-2.0

import "./LicenseStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract License is LicenseStorageModel, ModuleStorage {
    bytes32 public constant NAME = "License";

    constructor(address _registry) public WithRegistry(_registry) {
        // Empty
    }
}
