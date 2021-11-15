pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./PolicyStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract Policy is PolicyStorageModel, ModuleStorage {
    bytes32 public constant NAME = "Policy";

    constructor(address _registry) WithRegistry(_registry) {}
}
