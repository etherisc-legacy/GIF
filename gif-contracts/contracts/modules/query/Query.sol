pragma solidity 0.6.11;
// SPDX-License-Identifier: Apache-2.0

import "./QueryStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract Query is QueryStorageModel, ModuleStorage {
    bytes32 public constant NAME = "Query";

    constructor(address _registry) public WithRegistry(_registry) {}
}
