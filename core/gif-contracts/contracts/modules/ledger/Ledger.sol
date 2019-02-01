pragma solidity 0.5.2;

import "./LedgerStorageModel.sol";
import "../../shared/WithRegistry.sol";
import "../../shared/ModuleStorage.sol";

contract Ledger is WithRegistry, LedgerStorageModel, ModuleStorage {
    constructor(address _registry) public WithRegistry(_registry) {}
}
