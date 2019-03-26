pragma solidity 0.5.2;

import "./BaseModuleController.sol";
import "./WithRegistry.sol";

contract ModuleController is WithRegistry, BaseModuleController {
    /* solhint-disable payable-fallback */
    function() external {
        revert("ERROR::FALLBACK_FUNCTION_NOW_ALLOWED");
    }
    /* solhint-enable payable-fallback */

    function assignStorage(address _storage) external onlyInstanceOperator {
        _assignStorage(_storage);
    }
}
