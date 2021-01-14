pragma solidity 0.6.11;
// SPDX-License-Identifier: Apache-2.0

import "./LedgerStorageModel.sol";
import "../../shared/WithRegistry.sol";
import "../../shared/ModuleStorage.sol";

contract Ledger is WithRegistry, LedgerStorageModel, ModuleStorage {
    constructor(address _registry) public WithRegistry(_registry) {}
}
