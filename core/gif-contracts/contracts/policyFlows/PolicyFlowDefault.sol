pragma solidity 0.5.2;

import "../shared/WithRegistry.sol";
import "../modules/policy/IPolicy.sol";
import "../modules/policy/IPolicyController.sol";
import "../modules/license/ILicenseController.sol";
import "../modules/query/IQueryController.sol";

contract PolicyFlowDefault is WithRegistry {
    bytes32 public constant NAME = "PolicyFlowDefault";

    constructor(address _registry) public WithRegistry(_registry) {}

    function newApplication(
        bytes32 _bpExternalKey,
        uint256 _premium,
        bytes32 _currency,
        uint256[] memory _payoutOptions
    ) public returns (uint256 _applicationId) {
        uint256 productId = license().getProductId(msg.sender);

        uint256 metadataId = policy().createPolicyFlow(
            productId,
            _bpExternalKey
        );

        uint256 applicationId = policy().createApplication(
            productId,
            metadataId,
            _premium,
            _currency,
            _payoutOptions
        );

        _applicationId = applicationId;
    }

    function underwrite(uint256 _applicationId)
        external
        returns (uint256 _policyId)
    {
        uint256 productId = license().getProductId(msg.sender);

        require(
            policy().getApplicationState(
                productId,
                _applicationId
            ) == IPolicy.ApplicationState.Applied,
            "ERROR::INVALID_APPLICATION_STATE"
        );

        policy().setApplicationState(
            productId,
            _applicationId,
            IPolicy.ApplicationState.Underwritten
        );

        (uint256 metadataId, , , ) = policy().getApplicationData(
            productId,
            _applicationId
        );

        uint256 policyId = policy().createPolicy(productId, metadataId);

        _policyId = policyId;
    }

    function decline(uint256 _applicationId) external {
        uint256 productId = license().getProductId(msg.sender);

        require(
            policy().getApplicationState(
                productId,
                _applicationId
            ) == IPolicy.ApplicationState.Applied,
            "ERROR::INVALID_APPLICATION_STATE"
        );

        policy().setApplicationState(
            productId,
            _applicationId,
            IPolicy.ApplicationState.Declined
        );
    }

    function newClaim(uint256 _policyId) external returns (uint256 _claimId) {
        uint256 productId = license().getProductId(msg.sender);

        uint256 claimId = policy().createClaim(productId, _policyId, "");

        _claimId = claimId;
    }

    function confirmClaim(uint256 _claimId, uint256 _sum)
        external
        returns (uint256 _payoutId)
    {
        uint256 productId = license().getProductId(msg.sender);

        require(
            policy().getClaimState(
                productId,
                _claimId
            ) == IPolicy.ClaimState.Applied,
            "ERROR::INVALID_CLAIM_STATE"
        );

        policy().setClaimState(
            productId,
            _claimId,
            IPolicy.ClaimState.Confirmed
        );

        uint256 payoutId = policy().createPayout(productId, _claimId, _sum);

        _payoutId = payoutId;
    }

    function declineClaim(uint256 _claimId) external {
        uint256 productId = license().getProductId(msg.sender);

        require(
            policy().getClaimState(
                productId,
                _claimId
            ) == IPolicy.ClaimState.Applied,
            "ERROR::INVALID_CLAIM_STATE"
        );

        policy().setClaimState(
            productId,
            _claimId,
            IPolicy.ClaimState.Declined
        );
    }

    function expire(uint256 _policyId) external {
        uint256 productId = license().getProductId(msg.sender);

        require(
            policy().getPolicyState(
                productId,
                _policyId
            ) == IPolicy.PolicyState.Active,
            "ERROR::INVALID_POLICY_STATE"
        );

        policy().setPolicyState(
            productId,
            _policyId,
            IPolicy.PolicyState.Expired
        );
    }

    function payout(uint256 _payoutId, uint256 _amount)
        external
        returns (uint256 _remainder)
    {
        uint256 productId = license().getProductId(msg.sender);

        _remainder = policy().payOut(productId, _payoutId, _amount);
    }

    function register(bytes32 _productName, bytes32 _policyFlow) external {
        license().register(_productName, msg.sender, _policyFlow);
    }

    function request(
        bytes calldata _input,
        string calldata _callbackMethodName,
        address _callabackContractAddress,
        bytes32 _oracleTypeName,
        uint256 _responsibleOracleId
    ) external returns (uint256 _requestId) {
        _requestId = query().request(
            _input,
            _callbackMethodName,
            _callabackContractAddress,
            _oracleTypeName,
            _responsibleOracleId
        );
    }

    function getPayoutOptions(uint256 _applicationId)
        external
        view
        returns (uint256[] memory _payoutOptions)
    {
        uint256 productId = license().getProductId(msg.sender);

        _payoutOptions = policy().getPayoutOptions(productId, _applicationId);
    }

    function getPremium(uint256 _applicationId)
        external
        view
        returns (uint256 _premium)
    {
        uint256 productId = license().getProductId(msg.sender);

        _premium = policy().getPremium(productId, _applicationId);
    }

    function license() internal view returns (ILicenseController) {
        return ILicenseController(getContract("License"));
    }

    function policy() internal view returns (IPolicyController) {
        return IPolicyController(getContract("Policy"));
    }

    function query() internal view returns (IQueryController) {
        return IQueryController(getContract("Query"));
    }
}
