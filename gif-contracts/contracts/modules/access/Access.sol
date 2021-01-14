pragma solidity 0.6.11;

import "./AccessStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract Access is AccessStorageModel, ModuleStorage {
    constructor(address _registry) public WithRegistry(_registry) {}
}
