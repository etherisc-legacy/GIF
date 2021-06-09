pragma solidity ^0.6.0;
// SPDX-License-Identifier: Apache-2.0

import "./RBAC.sol";
import "./IProductService.sol";

contract Product is RBAC {

    bool public developmentMode = false;
    bool public maintenanceMode = false;
    bool public onChainPaymentMode = false;
    uint256 public productId;

    IProductService public productService;

    modifier onlySandbox {
        require(
            msg.sender == productService.getService("Sandbox"),
            "ERROR::ACCESS_DENIED"
        );
        _;
    }

    modifier onlyOracle {
        require(
            msg.sender == productService.getContract("Query"),
            "ERROR::ACCESS_DENIED"
        );
        _;
    }

    constructor(address _productService, bytes32 _name, bytes32 _policyFlow)
        public
    {
        productService = IProductService(_productService);
        _register(_name, _policyFlow);
    }

    function setDevelopmentMode(bool _newMode) internal {
        developmentMode = _newMode;
    }

    function setMaintenanceMode(bool _newMode) internal {
        maintenanceMode = _newMode;
    }

    function setOnChainPaymentMode(bool _newMode) internal {
        onChainPaymentMode = _newMode;
    }

    function _register(bytes32 _productName, bytes32 _policyFlow) internal {
        productId = productService.register(_productName, _policyFlow);
    }

    function _newApplication(
        bytes32 _bpKey,
        bytes _options
    )
        internal
        returns (uint256 _applicationId)
    {
        _applicationId = productService.newApplication(
            _bpKey,
            _options
        );
    }

    function _underwrite(
        bytes32 _bpKey
    )
        internal
    {
        productService.underwrite(_bpKey);
    }

    function _decline(
        bytes32 _bpKey
    )
        internal
    {
        productService.decline(_bpKey);
    }

    function _newClaim(
        uint256 _bpKey,
        bytes _data
    )
        internal
        returns (uint256 _claimId)
    {
        _claimId = productService.newClaim(_bpKey, _data);
    }

    function _confirmClaim(
        bytes32 _bpKey,
        uint256 _claimId,
        uint256 _data
    )
        internal
        returns (uint256 _payoutId)
    {
        _payoutId = productService.confirmClaim(_claimId, _data);
    }

    function _declineClaim(
        bytes32 _bpKey,
        uint256 _claimId
    )
        internal
    {
        productService.declineClaim(_bpKey);
    }

    function _expire(
        uint256 _policyId
    )
        internal
    {
        productService.expire(_bpKey);
    }

    function _payout(
        bytes32 _bpKey,
        uint256 _payoutId,
        bytes _data
    )
        internal
    {
        productService.payout(_bpKey, _payoutId, _data);
    }

    function _request(
        bytes memory _input,
        string memory _callbackMethodName,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    )
        internal
        returns (uint256 _requestId)
    {
        _requestId = productService.request(
            _input,
            _callbackMethodName,
            address(this),
            _oracleTypeName,
            _responsibleOracleId
        );
    }
}
