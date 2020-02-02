pragma solidity 0.5.12;

import "./AccessStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract Access is AccessStorageModel, ModuleStorage {
    constructor(address _registry) public WithRegistry(_registry) {}
}
