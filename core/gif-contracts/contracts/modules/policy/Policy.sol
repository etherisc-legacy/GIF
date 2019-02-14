pragma solidity 0.5.2;

import "./PolicyStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract Policy is PolicyStorageModel, ModuleStorage {
    bytes32 public constant NAME = "Policy";

    constructor(address _registry) public WithRegistry(_registry) {}
}
