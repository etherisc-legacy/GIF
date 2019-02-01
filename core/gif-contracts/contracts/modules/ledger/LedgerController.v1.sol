pragma solidity 0.5.2;

import "./LedgerStorageModel.sol";
import "../../shared/WithRegistry.sol";
import "../../shared/ModuleController.sol";

contract LedgerController is WithRegistry, LedgerStorageModel, ModuleController {
    constructor(address _registry) public WithRegistry(_registry) {}
}
