pragma solidity 0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./shared/RBAC.sol";
import "./services/IProductService.sol";

contract Product is RBAC, Ownable {
    using SafeMath for *;

    bool public developmentMode = false;
    bool public maintenanceMode = false;

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
        internal
    {
        productService = IProductService(_productService);
        _register(_name, _policyFlow);
    }

    function toggleDevelopmentMode() internal {
        developmentMode = !developmentMode;
    }

    function toggleMaintenanceMode() internal {
        maintenanceMode = !maintenanceMode;
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

    function _expire(uint256 _policyId) internal {
        productService.expire(_policyId);
    }

    function _payout(uint256 _payoutId, uint256 _amount)
        internal
        returns (uint256 _remainder)
    {
        _remainder = productService.payout(_payoutId, _amount);
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
