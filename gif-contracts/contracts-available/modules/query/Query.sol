pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./QueryStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract Query is QueryStorageModel, ModuleStorage {
    bytes32 public constant NAME = "Query";

    constructor(address _registry) WithRegistry(_registry) {}
}
