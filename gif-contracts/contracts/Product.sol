pragma solidity 0.6.11;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./shared/RBAC.sol";
import "./services/IProductService.sol";
import "./services/IRiskPoolService.sol";

contract Product is RBAC {
    using SafeMath for *;

    bool public developmentMode = false;
    bool public maintenanceMode = false;
    bool public onChainPaymentMode = false;

    IProductService public productService;
    IRiskPoolService public riskPoolService;

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

    constructor(address _productService, address _riskPoolService, bytes32 _name, bytes32 _policyFlow)
        internal
    {
        productService = IProductService(_productService);
        riskPoolService = IRiskPoolService(_riskPoolService);
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
        productService.register(_productName, _policyFlow);
    }

    function _newApplication(
        bytes32 _bpExternalKey,
        uint256 _premium,
        bytes32 _currency,
        uint256[] memory _payoutOptions
    ) internal returns (uint256 _applicationId) {
        _applicationId = productService.newApplication(
            _bpExternalKey,
            _premium,
            _currency,
            _payoutOptions
        );

        // for on-chain payments, we forward the premium to the premium collector contract.
        if (onChainPaymentMode) {
            riskPoolService.getRiskPoolAddress().transfer(msg.value);
        }

    }

    function _underwrite(uint256 _applicationId)
        internal
        returns (uint256 _policyId)
    {
        _policyId = productService.underwrite(_applicationId);
    }

    function _decline(uint256 _applicationId) internal {
        productService.decline(_applicationId);
    }

    function _newClaim(uint256 _policyId) internal returns (uint256 _claimId) {
        _claimId = productService.newClaim(_policyId);
    }

    function _confirmClaim(uint256 _claimId, uint256 _amount)
    internal
    returns (uint256 _payoutId)
    {
        _payoutId = productService.confirmClaim(_claimId, _amount);
    }

    function _declineClaim(uint256 _claimId)
    internal
    {
        productService.declineClaim(_claimId);
    }

    function _expire(uint256 _policyId) internal {
        productService.expire(_policyId);
    }

    function _payout(uint256 _payoutId, uint256 _amount)
        internal
        returns (uint256 _remainder)
    {
        _remainder = productService.payout(_payoutId, _amount);
        // for on-chain payments, we forward the premium to the premium collector contract.
        if (onChainPaymentMode) {
            riskPoolService.getRiskPoolAddress().transfer(msg.value);
        }


    }

    function _getPayoutOptions(uint256 _applicationId)
        internal
        returns (uint256[] memory _payoutOptions)
    {
        _payoutOptions = productService.getPayoutOptions(_applicationId);
    }

    function _getPremium(uint256 _applicationId)
        internal
        returns (uint256 _premium)
    {
        _premium = productService.getPremium(_applicationId);
    }

    function _request(
        bytes memory _input,
        string memory _callbackMethodName,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    ) internal returns (uint256 _requestId) {
        _requestId = productService.request(
            _input,
            _callbackMethodName,
            address(this),
            _oracleTypeName,
            _responsibleOracleId
        );
    }
}
