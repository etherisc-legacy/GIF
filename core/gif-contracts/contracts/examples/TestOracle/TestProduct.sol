pragma solidity 0.5.2;

import "../../Product.sol";

contract TestProduct is Product {
    bytes32 public constant NAME = "TestProduct";
    bytes32 public constant POLICY_FLOW = "PolicyFlowDefault";

    constructor(address _productController)
        public
        Product(_productController, NAME, POLICY_FLOW)
    {}

    function makeRequest(
        uint256 _requestValue
    ) external {
        request(
            abi.encode(_requestValue),
            "requestCallback",
            "Test",
            0
        );
    }

    function requestCallback(
        uint256 _requestId,
        bytes calldata _response
    ) external {
        uint256 _returnValue = abi.decode(_response, (uint256));
    }
}
