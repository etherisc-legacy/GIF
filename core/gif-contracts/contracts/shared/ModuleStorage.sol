pragma solidity 0.5.2;

import "./BaseModuleStorage.sol";
import "./WithRegistry.sol";


contract ModuleStorage is WithRegistry, BaseModuleStorage {

    function () external {
        // todo: restrict to controllers
        _delegate(controller);
    }

    function assignController(address _controller) external {
        _assignController(_controller);
    }
}
