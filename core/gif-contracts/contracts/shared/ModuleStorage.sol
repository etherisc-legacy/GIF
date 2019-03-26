pragma solidity 0.5.2;

import "./BaseModuleStorage.sol";
import "./WithRegistry.sol";

contract ModuleStorage is WithRegistry, BaseModuleStorage {
    /* solhint-disable payable-fallback */
    function() external {
        // todo: restrict to controllers
        _delegate(controller);
    }
    /* solhint-enable payable-fallback */

    function assignController(address _controller)
        external
        onlyInstanceOperator
    {
        _assignController(_controller);
    }
}
