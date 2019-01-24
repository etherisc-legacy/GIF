pragma solidity 0.5.2;

import "../shared/WithRegistry.sol";
import "../modules/policy/IPolicy.sol";
import "../modules/policy/IPolicyController.v1.sol";
import "../modules/license/ILicenseController.sol";


contract PolicyFlowDefault is WithRegistry {

    bytes32 public constant NAME = "PolicyFlowDefault";

    bytes4 public constant INTERFACE_ID =
        bytes4(keccak256("newApplication(bytes32,uint256,uint256,uint256[])")) ^
        bytes4(keccak256("newClaim(uint256)")) ^
        bytes4(keccak256("confirmClaim(uint256,uint256)")) ^
        bytes4(keccak256("declineClaim(uint256)")) ^
        bytes4(keccak256("decline(uint256)")) ^
        bytes4(keccak256("expire(uint256)")) ^
        bytes4(keccak256("getPayoutOptions(uint256)")) ^
        bytes4(keccak256("payout(uint256,uint256)")) ^
        bytes4(keccak256("register(bytes32)")) ^
        bytes4(keccak256("underwrite(uint256)")) ^
        bytes4(keccak256("getPremium(uint256)"));

    constructor(address _registry) public WithRegistry(_registry) {}

    function newApplication(
        bytes32 _customerExternalId,
        uint256 _premium,
        uint256 _currency,
        uint256[] calldata _payoutOptions
    )
    external returns (uint256 _applicationId) {
        uint256 insuranceApplicationId = license().getInsuranceApplicationId(msg.sender);

        uint256 _matadataId = policy().createPolicyFlow(insuranceApplicationId);

        uint256 applicationId = policy()
            .createApplication(
                insuranceApplicationId,
                _matadataId,
                _customerExternalId,
                _premium,
                _currency,
                _payoutOptions
            );

        _applicationId = applicationId;
    }

    function newClaim(uint256 _policyId) external returns (uint256 _claimId) {
        uint256 insuranceApplicationId = license().getInsuranceApplicationId(msg.sender);

        uint256 claimId = policy().createClaim(insuranceApplicationId, _policyId, "");

        _claimId = claimId;
    }

    function confirmClaim(uint256 _claimId, uint256 _sum) external returns (uint256 _payoutId) {
        uint256 insuranceApplicationId = license().getInsuranceApplicationId(msg.sender);

        policy().setClaimState(insuranceApplicationId, _claimId, IPolicy.ClaimState.Confirmed);

        uint256 payoutId = policy().createPayout(insuranceApplicationId, _claimId, _sum);

        _payoutId = payoutId;
    }

    function declineClaim(uint256 _claimId) external {
        uint256 insuranceApplicationId = license().getInsuranceApplicationId(msg.sender);

        policy().setClaimState(insuranceApplicationId, _claimId, IPolicy.ClaimState.Declined);
    }

    function decline(uint256 _applicationId) external {
        uint256 insuranceApplicationId = license().getInsuranceApplicationId(msg.sender);

        policy().setApplicationState(insuranceApplicationId, _applicationId, IPolicy.ApplicationState.Declined);
    }

    function expire(uint256 _policyId) external {
        uint256 insuranceApplicationId = license().getInsuranceApplicationId(msg.sender);

        policy().setPolicyState(insuranceApplicationId, _policyId, IPolicy.PolicyState.Expired);
    }

    function getPayoutOptions(uint256 _applicationId) external view returns (uint256[] memory _payoutOptions) {
        uint256 insuranceApplicationId = license().getInsuranceApplicationId(msg.sender);

        _payoutOptions = policy().getPayoutOptions(insuranceApplicationId, _applicationId);
    }

    function payout(uint256 _payoutId, uint256 _amount) external returns (uint256 _remainder) {
        uint256 insuranceApplicationId = license().getInsuranceApplicationId(msg.sender);

        _remainder = policy().payOut(insuranceApplicationId, _payoutId, _amount);
    }

    function register(bytes32 _insuranceApplicationName, bytes32 _policyFlow) external {
        license().register(_insuranceApplicationName, msg.sender, _policyFlow);
    }

    function underwrite(uint256 _applicationId) external returns (uint256 _policyId) {
        uint256 insuranceApplicationId = license().getInsuranceApplicationId(msg.sender);

        policy().setApplicationState(insuranceApplicationId, _applicationId, IPolicy.ApplicationState.Underwritten);

        (uint256 metadataId, , , ,) = policy().getApplicationData(insuranceApplicationId, _applicationId);

        uint256 policyId = policy().createPolicy(insuranceApplicationId, metadataId);

        _policyId = policyId;
    }

    function getPremium(uint256 _applicationId) external view returns (uint256 _premium) {
        uint256 insuranceApplicationId = license().getInsuranceApplicationId(msg.sender);

        _premium = policy().getPremium(insuranceApplicationId, _applicationId);
    }

    function license() internal view returns (ILicenseController) {
        return ILicenseController(getContract("License"));
    }

    function policy() internal view returns (IPolicyController) {
        return IPolicyController(getContract("Policy"));
    }
}
