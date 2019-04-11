pragma solidity 0.5.2;

import "./RegistryStorageModel.sol";
import "../../shared/BaseModuleStorage.sol";

contract Registry is RegistryStorageModel, BaseModuleStorage {
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
