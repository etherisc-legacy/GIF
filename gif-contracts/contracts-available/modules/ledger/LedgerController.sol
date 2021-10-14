pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./LedgerStorageModel.sol";
import "../../shared/WithRegistry.sol";
import "../../shared/ModuleController.sol";

contract LedgerController is
    WithRegistry,
    LedgerStorageModel,
    ModuleController
{
    bytes32 public constant NAME = "LedgerController";

    constructor(address _registry) WithRegistry(_registry) {}
}
