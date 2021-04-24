pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./BaseModuleStorage.sol";
import "./WithRegistry.sol";

abstract contract ModuleStorage is WithRegistry, BaseModuleStorage {
    /* solhint-disable payable-fallback */
    fallback() external override {
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
