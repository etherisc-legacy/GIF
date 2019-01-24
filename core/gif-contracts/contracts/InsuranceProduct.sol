pragma solidity 0.5.2;

import "./shared/RBAC.sol";
import "./controllers/IProductController.sol";


contract InsuranceProduct is RBAC {

    bool public developmentMode = false;
    bool public maintenanceMode = false;

    IProductController public productController;

    constructor(address _productController, bytes32 _name, bytes32 _policyFlow) internal {
        productController = IProductController(_productController);
        register(_name, _policyFlow);
    }

    function toggleDevelopmentMode() internal {
        developmentMode = !developmentMode;
    }

    function toggleMaintenanceMode() internal {
        maintenanceMode = !maintenanceMode;
    }

    function register(bytes32 _insuranceApplicationName, bytes32 _policyFlow) internal {
        productController.register(_insuranceApplicationName, _policyFlow);
    }

    function newApplication(
        bytes32 _customerExternalId,
        uint256 _premium,
        uint256 _currency,
        uint256[] memory _payoutOptions
    ) internal returns (uint256 _applicationId) {
        _applicationId = productController.newApplication(_customerExternalId, _premium, _currency, _payoutOptions);
    }

    function underwrite(uint256 _applicationId) internal returns (uint256 _policyId) {
        _policyId = productController.underwrite(_applicationId);
    }

    function decline(uint256 _applicationId) internal {
        productController.decline(_applicationId);
    }

    function newClaim(uint256 _policyId) internal returns (uint256 _claimId) {
        _claimId = productController.newClaim(_policyId);
    }

    function confirmClaim(uint256 _claimId, uint256 _amount) internal returns (uint256 _payoutId) {
        _payoutId = productController.confirmClaim(_claimId, _amount);
    }

    function expire(uint256 _policyId) internal {
        productController.expire(_policyId);
    }

    function payout(uint256 _payoutId, uint256 _amount) internal returns (uint256 _remainder) {
        _remainder = productController.payout(_payoutId, _amount);
    }

    function getPayoutOptions(uint256 _applicationId) internal returns (uint256[] memory _payoutOptions) {
        _payoutOptions = productController.getPayoutOptions(_applicationId);
    }

    function getPremium(uint256 _applicationId) internal returns (uint256 _premium) {
        _premium = productController.getPremium(_applicationId);
    }
}
