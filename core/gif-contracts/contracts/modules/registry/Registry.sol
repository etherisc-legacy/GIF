pragma solidity 0.5.2;

import "./RegistryStorageModel.sol";
import "../../shared/BaseModuleStorage.sol";


contract Registry is RegistryStorageModel, BaseModuleStorage {

    constructor(address _controller) public {
        // Init
        services["DAO"] = msg.sender;
        _assignController(_controller);
    }

    function assignController(address _controller) external {
        // todo: use onlyDAO modifier
        require(msg.sender == services["DAO"], "ERROR::NOT_AUTHORIZED");
        _assignController(_controller);
    }
}
