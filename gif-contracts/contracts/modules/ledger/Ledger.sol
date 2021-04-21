pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./LedgerStorageModel.sol";
import "../../shared/WithRegistry.sol";
import "../../shared/ModuleStorage.sol";

contract Ledger is WithRegistry, LedgerStorageModel, ModuleStorage {
    constructor(address _registry) WithRegistry(_registry) {}
}
