pragma solidity 0.5.2;

import "./shared/RBAC.sol";
import "./services/IProductService.sol";


contract InsuranceProduct is RBAC {

    bool public developmentMode = false;
    bool public maintenanceMode = false;

    IProductService public productService;

    constructor(address _productService, bytes32 _name, bytes32 _policyFlow) internal {
        productService = IProductService(_productService);
        register(_name, _policyFlow);
    }

    function toggleDevelopmentMode() internal {
        developmentMode = !developmentMode;
    }

    function toggleMaintenanceMode() internal {
        maintenanceMode = !maintenanceMode;
    }

    function register(bytes32 _insuranceApplicationName, bytes32 _policyFlow) internal {
        productService.register(_insuranceApplicationName, _policyFlow);
    }

    function newApplication(
        bytes32 _customerExternalId,
        uint256 _premium,
        uint256 _currency,
        uint256[] memory _payoutOptions
    ) internal returns (uint256 _applicationId) {
        _applicationId = productService.newApplication(_customerExternalId, _premium, _currency, _payoutOptions);
    }

    function underwrite(uint256 _applicationId) internal returns (uint256 _policyId) {
        _policyId = productService.underwrite(_applicationId);
    }

    function decline(uint256 _applicationId) internal {
        productService.decline(_applicationId);
    }

    function newClaim(uint256 _policyId) internal returns (uint256 _claimId) {
        _claimId = productService.newClaim(_policyId);
    }

    function confirmClaim(uint256 _claimId, uint256 _amount) internal returns (uint256 _payoutId) {
        _payoutId = productService.confirmClaim(_claimId, _amount);
    }

    function expire(uint256 _policyId) internal {
        productService.expire(_policyId);
    }

    function payout(uint256 _payoutId, uint256 _amount) internal returns (uint256 _remainder) {
        _remainder = productService.payout(_payoutId, _amount);
    }

    function getPayoutOptions(uint256 _applicationId) internal returns (uint256[] memory _payoutOptions) {
        _payoutOptions = productService.getPayoutOptions(_applicationId);
    }

    function getPremium(uint256 _applicationId) internal returns (uint256 _premium) {
        _premium = productService.getPremium(_applicationId);
    }
}
