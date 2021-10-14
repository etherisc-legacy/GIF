pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./AccessStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract Access is AccessStorageModel, ModuleStorage {
    constructor(address _registry) WithRegistry(_registry) {}
}
