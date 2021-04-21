pragma solidity 0.6.11;
// SPDX-License-Identifier: Apache-2.0

import "./RegistryStorageModel.sol";
import "../../shared/BaseModuleStorage.sol";

contract Registry is RegistryStorageModel, BaseModuleStorage {
    bytes32 public constant NAME = "Registry";

    constructor(address _controller) public {
        // Init
        controllers["InstanceOperator"] = msg.sender;
        _assignController(_controller);
    }

    function assignController(address _controller) external {
        // todo: use onlyInstanceOperator modifier
        require(
            msg.sender == controllers["InstanceOperator"],
            "ERROR::NOT_AUTHORIZED"
        );
        _assignController(_controller);
    }
}
