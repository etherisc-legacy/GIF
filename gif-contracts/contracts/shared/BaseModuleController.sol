pragma solidity 0.6.11;

contract BaseModuleController {
    address public delegator;

    function _assignStorage(address _storage) internal {
        delegator = _storage;
    }
}
