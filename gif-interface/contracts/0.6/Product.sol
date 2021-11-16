// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.0;

import "./RBAC.sol";
import "./IProductService.sol";

abstract contract Product is RBAC {

    bool public developmentMode = false;
    bool public maintenanceMode = false;
    bool public onChainPaymentMode = false;
    uint256 public productId;

    IProductService public productService;

    modifier onlySandbox {
        require(
            msg.sender == productService.getService("Sandbox"),
            "ERROR:PRO-001:ACCESS_DENIED"
        );
        _;
    }

    modifier onlyOracle {
        require(
            msg.sender == productService.getContract("Query"),
            "ERROR:PRO-002:ACCESS_DENIED"
        );
        _;
    }

    constructor(address _productService, bytes32 _name, bytes32 _policyFlow)
        public
    {
        productService = IProductService(_productService);
        productId = _proposeProduct(_name, _policyFlow);
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

    function _proposeProduct(bytes32 _productName, bytes32 _policyFlow)
        internal
        returns (uint256 _productId)
    {
        _productId = productService.proposeProduct(_productName, _policyFlow);
    }

    function _newApplication(
        bytes32 _bpKey,
        bytes memory _data
    )
        internal
    {
        productService.newApplication(_bpKey, _data);
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
        bytes32 _bpKey,
        bytes memory _data
    )
        internal
        returns (uint256 _claimId)
    {
        _claimId = productService.newClaim(_bpKey, _data);
    }

    function _confirmClaim(
        bytes32 _bpKey,
        uint256 _claimId,
        bytes memory _data
    )
        internal
        returns (uint256 _payoutId)
    {
        _payoutId = productService.confirmClaim(_bpKey, _claimId, _data);
    }

    function _declineClaim(
        bytes32 _bpKey,
        uint256 _claimId
    )
        internal
    {
        productService.declineClaim(_bpKey, _claimId);
    }

    function _expire(
        bytes32 _bpKey
    )
        internal
    {
        productService.expire(_bpKey);
    }

    function _payout(
        bytes32 _bpKey,
        uint256 _payoutId,
        bool _complete,
        bytes memory _data
    )
        internal
    {
        productService.payout(_bpKey, _payoutId, _complete, _data);
    }

    function _request(
        bytes32 _bpKey,
        bytes memory _input,
        string memory _callbackMethodName,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    )
        internal
        returns (uint256 _requestId)
    {
        _requestId = productService.request(
            _bpKey,
            _input,
            _callbackMethodName,
            address(this),
            _oracleTypeName,
            _responsibleOracleId
        );
    }

    function _getApplicationData(bytes32 _bpKey) internal view returns (bytes memory _data) {
        return productService.getApplicationData(_bpKey);
    }

    function _getClaimData(bytes32 _bpKey, uint256 _claimId) internal view returns (bytes memory _data) {
        return productService.getClaimData(_bpKey, _claimId);
    }

    function _getApplicationData(bytes32 _bpKey, uint256 _payoutId) internal view returns (bytes memory _data) {
        return productService.getPayoutData(_bpKey, _payoutId);
    }

}
