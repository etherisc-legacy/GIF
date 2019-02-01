pragma solidity 0.5.2;

import "./QueryStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract Query is QueryStorageModel, ModuleStorage {
    bytes32 public constant NAME = "Query";

    constructor(address _registry) public WithRegistry(_registry) {}
}
