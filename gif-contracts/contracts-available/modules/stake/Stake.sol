pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./StakeStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract Stake is StakeStorageModel, ModuleStorage {
    bytes32 public constant NAME = "Stake";

    constructor(address _registry) WithRegistry(_registry) {}
}
