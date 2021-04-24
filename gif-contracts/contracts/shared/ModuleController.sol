pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./BaseModuleController.sol";
import "./WithRegistry.sol";

abstract contract ModuleController is WithRegistry, BaseModuleController {
    /* solhint-disable payable-fallback */
    fallback() external {
        revert("ERROR::FALLBACK_FUNCTION_NOW_ALLOWED");
    }

    /* solhint-enable payable-fallback */

    function assignStorage(address _storage) external onlyInstanceOperator {
        _assignStorage(_storage);
    }
}
