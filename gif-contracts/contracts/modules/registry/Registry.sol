pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./RegistryStorageModel.sol";
import "../../shared/BaseModuleStorage.sol";

contract Registry is RegistryStorageModel, BaseModuleStorage {
    bytes32 public constant NAME = "Registry";

    constructor(address _controller, bytes32 _initialRelease) {
        // Init
        release = _initialRelease;
        contracts[release]["InstanceOperatorService"] = msg.sender;
        contractNames[release].push("InstanceOperatorService");
        contractsInRelease[release] = 1;
        _assignController(_controller);
    }

    function assignController(address _controller) external {
        // todo: use onlyInstanceOperator modifier
        require(
            msg.sender == contracts[release]["InstanceOperator"],
            "ERROR::NOT_AUTHORIZED"
        );
        _assignController(_controller);
    }
}
