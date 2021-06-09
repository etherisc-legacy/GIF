pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "../shared/WithRegistry.sol";
import "../modules/policy/IPolicy.sol";
import "../modules/policy/IPolicyController.sol";
import "../modules/license/ILicenseController.sol";
import "../modules/query/IQueryController.sol";

contract PolicyFlowDefault is WithRegistry {
    bytes32 public constant NAME = "PolicyFlowDefault";

    constructor(address _registry) WithRegistry(_registry) {}

    function newApplication(
        bytes32 _bpExternalKey,
        uint256 _premium,
        bytes32 _currency,
        uint256[] memory _payoutOptions
    ) public returns (uint256 _applicationId) {
        uint256 productId = license().getProductId(msg.sender);

        uint256 metadataId =
            policy().createPolicyFlow(productId, _bpExternalKey);

        uint256 applicationId =
            policy().createApplication(
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
        require(
            policy().getApplicationState(_applicationId) ==
                IPolicy.ApplicationState.Applied,
            "ERROR::INVALID_APPLICATION_STATE"
        );

        policy().setApplicationState(
            _applicationId,
            IPolicy.ApplicationState.Underwritten
        );

        (uint256 metadataId, , , ) =
            policy().getApplicationData(_applicationId);

        uint256 policyId = policy().createPolicy(metadataId);

        _policyId = policyId;
    }

    function decline(uint256 _applicationId) external {
        require(
            policy().getApplicationState(_applicationId) ==
                IPolicy.ApplicationState.Applied,
            "ERROR::INVALID_APPLICATION_STATE"
        );

        policy().setApplicationState(
            _applicationId,
            IPolicy.ApplicationState.Declined
        );
    }

    function newClaim(uint256 _policyId) external returns (uint256 _claimId) {
        uint256 claimId = policy().createClaim(_policyId, "");

        _claimId = claimId;
    }

    function confirmClaim(uint256 _claimId, uint256 _sum)
        external
        returns (uint256 _payoutId)
    {
        require(
            policy().getClaimState(_claimId) ==
                IPolicy.ClaimState.Applied,
            "ERROR::INVALID_CLAIM_STATE"
        );

        policy().setClaimState(
            _claimId,
            IPolicy.ClaimState.Confirmed
        );

        uint256 payoutId = policy().createPayout(_claimId, _sum);

        _payoutId = payoutId;
    }

    function declineClaim(uint256 _claimId) external {
        require(
            policy().getClaimState(_claimId) ==
                IPolicy.ClaimState.Applied,
            "ERROR::INVALID_CLAIM_STATE"
        );

        policy().setClaimState(
            _claimId,
            IPolicy.ClaimState.Declined
        );
    }

    function expire(uint256 _policyId) external {
        require(
            policy().getPolicyState(_policyId) ==
                IPolicy.PolicyState.Active,
            "ERROR::INVALID_POLICY_STATE"
        );

        policy().setPolicyState(
            _policyId,
            IPolicy.PolicyState.Expired
        );
    }

    function payout(uint256 _payoutId, uint256 _amount)
        external
        returns (uint256 _remainder)
    {
        _remainder = policy().payOut(_payoutId, _amount);
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
        _payoutOptions = policy().getPayoutOptions(_applicationId);
    }

    function getPremium(uint256 _applicationId)
        external
        view
        returns (uint256 _premium)
    {
        _premium = policy().getPremium(_applicationId);
    }

    function getMetadata(bytes32 _bpExternalKey)
        external
        view
        returns (
            uint256 productId,
            uint256 applicationId,
            uint256 policyId,
            // ERC721 token
            address tokenContract,
            // Core
            address registryContract,
            uint256 release,
            // Datetime
            uint256 createdAt,
            uint256 updatedAt
        )
    {

        (
            productId,
            applicationId,
            policyId,
            tokenContract,
            registryContract,
            release,
            createdAt,
            updatedAt
        ) = policy().getMetadataByExternalKey(_bpExternalKey);
    }

    function getStateMessage(bytes32 _bpExternalKey)
        external
        view
        returns (bytes32 stateMessage)
    {
        stateMessage = policy().getStateMessageByExternalKey(
            _bpExternalKey
        );
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
