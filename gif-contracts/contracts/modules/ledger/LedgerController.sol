pragma solidity 0.6.11;
// SPDX-License-Identifier: Apache-2.0

import "./LedgerStorageModel.sol";
import "../../shared/WithRegistry.sol";
import "../../shared/ModuleController.sol";

contract LedgerController is WithRegistry, LedgerStorageModel, ModuleController {
    constructor(address _registry) public WithRegistry(_registry) {}
}
