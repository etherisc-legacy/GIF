pragma solidity 0.5.2;

import "./Delegator.sol";


contract BaseModuleStorage is Delegator {

    address public controller;

    function () external {
        _delegate(controller);
    }

    function _assignController(address _controller) internal {
        controller = _controller;
    }
}
