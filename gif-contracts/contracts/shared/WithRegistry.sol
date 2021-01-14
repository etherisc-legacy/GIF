pragma solidity 0.6.11;
// SPDX-License-Identifier: Apache-2.0

import "../modules/registry/IRegistryController.sol";
import "./AccessModifiers.sol";

contract WithRegistry is AccessModifiers {
    IRegistryController public registry;

    constructor(address _registry) internal {
        registry = IRegistryController(_registry);
    }

    function assignRegistry(address _registry) external onlyInstanceOperator {
        registry = IRegistryController(_registry);
    }

    function getService(bytes32 _contractName)
        public
        override
        view
        returns (address _addr)
    {
        _addr = registry.getService(_contractName);
    }

    function getContract(bytes32 _contractName)
        public
        override
        view
        returns (address _addr)
    {
        _addr = registry.getContract(_contractName);
    }

    function getContractInRelease(uint256 _release, bytes32 _contractName)
        internal
        view
        returns (address _addr)
    {
        _addr = registry.getContractInRelease(_release, _contractName);
    }

    function getRelease() internal view returns (uint256 _release) {
        _release = registry.getRelease();
    }
}
