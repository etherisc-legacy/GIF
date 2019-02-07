pragma solidity 0.5.2;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./PolicyStorageModel.sol";
import "../../shared/ModuleController.sol";

contract PolicyController is PolicyStorageModel, ModuleController {
    using SafeMath for *;

    constructor(address _registry) public WithRegistry(_registry) {}

    /* Metadata */
    function createPolicyFlow(uint256 _productId)
        external
        onlyPolicyFlow("Policy")
        returns (uint256 _metadataId)
    {
        _metadataId = metadata[_productId].length++;

        Metadata storage metadatum = metadata[_productId][_metadataId];
        metadatum.state = PolicyFlowState.Started;
        metadatum.createdAt = block.timestamp;
        metadatum.updatedAt = block.timestamp;

        emit LogNewMetadata(
            _productId,
            _metadataId,
            PolicyFlowState.Started
        );
    }

    function setPolicyFlowState(
        uint256 _productId,
        uint256 _metadataId,
        PolicyFlowState _state
    ) external onlyPolicyFlow("Policy") {
        Metadata storage metadatum = metadata[_productId][_metadataId];
        metadatum.state = _state;
        metadatum.updatedAt = block.timestamp;

        emit LogMetadataStateChanged(_productId, _metadataId, _state);
    }

    /* Application */
    function createApplication(
        uint256 _productId,
        uint256 _metadataId,
        bytes32 _customerExternalId,
        uint256 _premium,
        bytes32 _currency,
        uint256[] calldata _payoutOptions
    ) external onlyPolicyFlow("Policy") returns (uint256 _applicationId) {
        _applicationId = applications[_productId].length++;

        Application storage application = applications[_productId][_applicationId];
        application.metadataId = _metadataId;
        application.customerExternalId = _customerExternalId;
        application.premium = _premium;
        application.currency = _currency;
        // todo: check payoutOptions values
        application.payoutOptions = _payoutOptions;
        application.state = ApplicationState.Applied;
        application.createdAt = block.timestamp;
        application.updatedAt = block.timestamp;

        Metadata storage metadatum = metadata[_productId][_metadataId];
        metadatum.applicationId = _applicationId;
        metadatum.hasApplication = true;
        metadatum.updatedAt = block.timestamp;

        emit LogNewApplication(
            _productId,
            _metadataId,
            _applicationId
        );
    }

    function setApplicationState(
        uint256 _productId,
        uint256 _applicationId,
        ApplicationState _state
    ) external onlyPolicyFlow("Policy") {
        Application storage application = applications[_productId][_applicationId];
        application.state = _state;
        application.updatedAt = block.timestamp;

        emit LogApplicationStateChanged(
            _productId,
            application.metadataId,
            _applicationId,
            _state
        );
    }

    /* Policy */
    function createPolicy(uint256 _productId, uint256 _metadataId)
        external
        onlyPolicyFlow("Policy")
        returns (uint256 _policyId)
    {
        _policyId = policies[_productId].length++;

        Policy storage policy = policies[_productId][_policyId];
        policy.metadataId = _metadataId;
        policy.state = PolicyState.Active;
        policy.createdAt = block.timestamp;
        policy.updatedAt = block.timestamp;

        Metadata storage metadatum = metadata[_productId][_metadataId];
        metadatum.policyId = _policyId;
        metadatum.hasPolicy = true;
        metadatum.updatedAt = block.timestamp;

        emit LogNewPolicy(_productId, _metadataId, _policyId, metadatum.applicationId);
    }

    function setPolicyState(
        uint256 _productId,
        uint256 _policyId,
        PolicyState _state
    ) external onlyPolicyFlow("Policy") {
        Policy storage policy = policies[_productId][_policyId];
        policy.state = _state;
        policy.updatedAt = block.timestamp;

        emit LogPolicyStateChanged(
            _productId,
            policy.metadataId,
            _policyId,
            _state
        );
    }

    /* Claim */
    function createClaim(
        uint256 _productId,
        uint256 _policyId,
        bytes32 _data
    ) external onlyPolicyFlow("Policy") returns (uint256 _claimId) {
        Policy storage policy = policies[_productId][_policyId];

        _claimId = claims[_productId].length++;

        Claim storage claim = claims[_productId][_claimId];
        claim.metadataId = policy.metadataId;
        claim.state = ClaimState.Applied;
        claim.data = _data;
        claim.createdAt = block.timestamp;
        claim.updatedAt = block.timestamp;

        Metadata storage metadatum = metadata[_productId][policy.metadataId];
        metadatum.claimIds.push(_claimId);
        metadatum.updatedAt = block.timestamp;

        emit LogClaimStateChanged(
            _productId,
            policy.metadataId,
            _policyId,
            ClaimState.Applied
        );
    }

    function setClaimState(
        uint256 _productId,
        uint256 _claimId,
        ClaimState _state
    ) external onlyPolicyFlow("Policy") {
        Claim storage claim = claims[_productId][_claimId];
        claim.state = _state;
        claim.updatedAt = block.timestamp;

        Metadata storage metadatum = metadata[_productId][claim.metadataId];

        emit LogClaimStateChanged(
            _productId,
            claim.metadataId,
            metadatum.policyId,
            _state
        );
    }

    /* Payout */
    function createPayout(
        uint256 _productId,
        uint256 _claimId,
        uint256 _amount
    ) external onlyPolicyFlow("Policy") returns (uint256 _payoutId) {
        Claim storage claim = claims[_productId][_claimId];

        _payoutId = payouts[_productId].length++;

        Payout storage payout = payouts[_productId][_payoutId];
        payout.metadataId = claim.metadataId;
        payout.claimId = _claimId;
        payout.state = PayoutState.Expected;
        payout.expectedAmount = _amount;
        payout.createdAt = block.timestamp;
        payout.updatedAt = block.timestamp;

        Metadata storage metadatum = metadata[_productId][claim.metadataId];
        metadatum.payoutIds.push(_payoutId);
        metadatum.updatedAt = block.timestamp;

        emit LogNewPayout(
            _productId,
            claim.metadataId,
            metadatum.policyId,
            _claimId,
            _amount,
            PayoutState.Expected
        );
    }

    function payOut(
        uint256 _productId,
        uint256 _payoutId,
        uint256 _amount
    ) external onlyPolicyFlow("Policy") returns (uint256 _remainder) {
        Payout storage payout = payouts[_productId][_payoutId];

        uint256 actualAmount = payout.actualAmount.add(_amount);

        // Check if actual payout amount is no more than expected
        require(
            payout.expectedAmount >= actualAmount,
            "ERROR::Amount is more than expected"
        );

        if (payout.expectedAmount == actualAmount) {
            // Full
            payout.expectedAmount = 0;
            payout.actualAmount = actualAmount;
            payout.state = PayoutState.PaidOut;
            payout.updatedAt = block.timestamp;

            _remainder = 0;
        } else {
            // Partial
            payout.actualAmount = actualAmount;
            payout.updatedAt = block.timestamp;

            _remainder = payout.expectedAmount.sub(payout.actualAmount);
        }
    }

    function setPayoutState(
        uint256 _productId,
        uint256 _payoutId,
        PayoutState _state
    ) external onlyPolicyFlow("Policy") {
        Payout storage payout = payouts[_productId][_payoutId];
        payout.state = _state;
        payout.updatedAt = block.timestamp;

        Metadata storage metadatum = metadata[_productId][payout.metadataId];

        emit LogPayoutStateChanged(
            _productId,
            payout.metadataId,
            metadatum.policyId,
            payout.claimId,
            _state
        );
    }

    /* Views */
    function getApplicationData(
        uint256 _productId,
        uint256 _applicationId
    )
        external
        view
        returns (
        uint256 _metadataId,
        bytes32 _customerExternalId,
        uint256 _premium,
        bytes32 _currency,
        ApplicationState _state
    )
    {
        _metadataId = applications[_productId][_applicationId].metadataId;
        _customerExternalId = applications[_productId][_applicationId].customerExternalId;
        _premium = applications[_productId][_applicationId].premium;
        _currency = applications[_productId][_applicationId].currency;
        _state = applications[_productId][_applicationId].state;
    }

    function getPayoutOptions(
        uint256 _productId,
        uint256 _applicationId
    ) external view returns (uint256[] memory _payoutOptions) {
        _payoutOptions = applications[_productId][_applicationId].payoutOptions;
    }

    function getPremium(uint256 _productId, uint256 _applicationId)
        external
        view
        returns (uint256 _premium)
    {
        _premium = applications[_productId][_applicationId].premium;
    }
}
