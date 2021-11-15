// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.6.11;

import "./PoolStorageModel.sol";
import "../../shared/ModuleStorage.sol";

contract Staking is PoolStorageModel, ModuleStorage {
    bytes32 public constant NAME = "Pool";

    constructor(address _registry) WithRegistry(_registry) {}

}
