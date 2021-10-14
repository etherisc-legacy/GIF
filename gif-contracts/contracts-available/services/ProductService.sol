pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "../shared/WithRegistry.sol";
import "../shared/Delegator.sol";
import "../modules/license/ILicenseController.sol";

contract ProductService is WithRegistry, Delegator {
    bytes32 public constant NAME = "ProductService";

    constructor(address _registry) WithRegistry(_registry) {}

    fallback() external {
        (bool authorized, address policyFlow) = license().authorize(msg.sender);

        require(authorized == true, "ERROR:PRS-001:NOT_AUTHORIZED");
        require(
            policyFlow != address(0),
            "ERROR:PRS-002:POLICY_FLOW_NOT_RESOLVED"
        );

        _delegate(policyFlow);
    }

    function proposeProduct(bytes32 _name, bytes32 _policyFlow)
        external
        returns (uint256 _productId)
    {
        _productId = license().proposeProduct(_name, msg.sender, _policyFlow);
    }

    function license() internal view returns (ILicenseController) {
        return ILicenseController(registry.getContract("License"));
    }
}
