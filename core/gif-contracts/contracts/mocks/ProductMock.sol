pragma solidity 0.5.2;

import "../Product.sol";

contract ProductMock is Product {

    bytes32 constant public NAME = "ProductMock";
    bytes32 constant public POLICY_FLOW = "PolicyFlowDefault";

    constructor(address _productController)
    public
    Product(_productController, NAME, POLICY_FLOW)
    {}

    function applyForPolicy(
        // domain specific
        // premium
        uint256 _premium,
        bytes32 _currency,
        uint256[] calldata _payoutOptions,
        // customer
        bytes32 _customerExternalId
    ) external {
        uint256 applicationId = newApplication(
            _customerExternalId,
            _premium,
            _currency,
            _payoutOptions
        );
    }

    function underwriteApplication(uint256 _applicationId) external {
        underwrite(_applicationId);
    }

    function delcineApplication(uint256 _applicationId) external {
        decline(_applicationId);
    }

    function newClaimTx(uint256 _policyId) external {

    }

    function confirmClaimTx(uint256 _policyId) external {

    }

    function expireTx(uint256 _policyId) external {

    }

    function payoutTx(uint256 _payoutId, uint256 _amount) external {

    }
}

