pragma solidity 0.5.2;

import "./BaseModuleController.sol";
import "./WithRegistry.sol";


contract ModuleController is WithRegistry, BaseModuleController {

    function() external {
        revert("ERROR::FALLBACK_FUNCTION_NOW_ALLOWED");
    }

    function assignStorage(address _storage) external onlyDAO {
        _assignStorage(_storage);
    }
}
