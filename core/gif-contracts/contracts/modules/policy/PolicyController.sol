pragma solidity 0.5.2;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./PolicyStorageModel.sol";
import "../../shared/ModuleController.sol";

contract PolicyController is PolicyStorageModel, ModuleController {
    using SafeMath for *;

    constructor(address _registry) public WithRegistry(_registry) {}

    /* Metadata */
    function createPolicyFlow(uint256 _productId, bytes32 _bpExternalKey)
        external
        onlyPolicyFlow("Policy")
        returns (uint256 _metadataId)
    {
        _metadataId = ++metadataIdIncrement;

        Metadata storage meta = metadata[_productId][_metadataId];

        assert(meta.createdAt == 0);

        meta.state = PolicyFlowState.Started;
        meta.bpExternalKey = _bpExternalKey;
        meta.createdAt = block.timestamp;
        meta.updatedAt = block.timestamp;

        emit LogNewMetadata(
            _productId,
            _bpExternalKey,
            _metadataId,
            PolicyFlowState.Started
        );
    }

    function setPolicyFlowState(
        uint256 _productId,
        uint256 _metadataId,
        PolicyFlowState _state
    ) external onlyPolicyFlow("Policy") {
        Metadata storage meta = metadata[_productId][_metadataId];

        require(meta.createdAt > 0, "ERROR::METADATA_NOT_EXISTS");

        meta.state = _state;
        meta.updatedAt = block.timestamp;

        emit LogMetadataStateChanged(_productId, _metadataId, _state);
    }

    /* Application */
    function createApplication(
        uint256 _productId,
        uint256 _metadataId,
        uint256 _premium,
        bytes32 _currency,
        uint256[] memory _payoutOptions
    ) public onlyPolicyFlow("Policy") returns (uint256 _applicationId) {
        _applicationId = ++applicationIdIncrement;

        Application storage application = applications[_productId][_applicationId];

        assert(application.createdAt == 0);

        application.metadataId = _metadataId;
        application.premium = _premium;
        application.currency = _currency;
        // todo: check payoutOptions values
        application.payoutOptions = _payoutOptions;
        application.state = ApplicationState.Applied;
        application.createdAt = block.timestamp;
        application.updatedAt = block.timestamp;

        Metadata storage meta = metadata[_productId][_metadataId];

        assert(meta.createdAt > 0);
        assert(meta.applicationId == 0);
        assert(meta.hasApplication == false);

        meta.applicationId = _applicationId;
        meta.hasApplication = true;
        meta.updatedAt = block.timestamp;

        emit LogNewApplication(_productId, _metadataId, _applicationId);
    }

    function setApplicationState(
        uint256 _productId,
        uint256 _applicationId,
        ApplicationState _state
    ) external onlyPolicyFlow("Policy") {
        Application storage application = applications[_productId][_applicationId];

        require(application.createdAt > 0, "ERROR::APPLICATION_NOT_EXISTS");

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
        _policyId = ++policyIdIncrement;

        Policy storage policy = policies[_productId][_policyId];

        assert(policy.createdAt == 0);

        policy.metadataId = _metadataId;
        policy.state = PolicyState.Active;
        policy.createdAt = block.timestamp;
        policy.updatedAt = block.timestamp;

        Metadata storage meta = metadata[_productId][_metadataId];

        assert(meta.createdAt > 0);
        assert(meta.policyId == 0);
        assert(meta.hasPolicy == false);

        meta.policyId = _policyId;
        meta.hasPolicy = true;
        meta.updatedAt = block.timestamp;

        emit LogNewPolicy(
            _productId,
            _metadataId,
            _policyId,
            meta.applicationId
        );
    }

    function setPolicyState(
        uint256 _productId,
        uint256 _policyId,
        PolicyState _state
    ) external onlyPolicyFlow("Policy") {
        Policy storage policy = policies[_productId][_policyId];

        require(policy.createdAt > 0, "ERROR::POLICY_NOT_EXISTS");

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
    function createClaim(uint256 _productId, uint256 _policyId, bytes32 _data)
        external
        onlyPolicyFlow("Policy")
        returns (uint256 _claimId)
    {
        Policy storage policy = policies[_productId][_policyId];

        require(policy.createdAt > 0, "ERROR::POLICY_NOT_EXISTS");

        _claimId = ++claimIdIncrement;

        Claim storage claim = claims[_productId][_claimId];

        assert(claim.createdAt == 0);

        claim.metadataId = policy.metadataId;
        claim.state = ClaimState.Applied;
        claim.data = _data;
        claim.createdAt = block.timestamp;
        claim.updatedAt = block.timestamp;

        Metadata storage meta = metadata[_productId][policy.metadataId];

        meta.claimIds.push(_claimId);
        meta.updatedAt = block.timestamp;

        emit LogNewClaim(
            _productId,
            policy.metadataId,
            _policyId,
            _claimId,
            ClaimState.Applied
        );
    }

    function setClaimState(
        uint256 _productId,
        uint256 _claimId,
        ClaimState _state
    ) external onlyPolicyFlow("Policy") {
        Claim storage claim = claims[_productId][_claimId];

        require(claim.createdAt > 0, "ERROR::CLAIM_NOT_EXISTS");

        claim.state = _state;
        claim.updatedAt = block.timestamp;

        Metadata storage meta = metadata[_productId][claim.metadataId];

        emit LogClaimStateChanged(
            _productId,
            claim.metadataId,
            meta.policyId,
            _claimId,
            _state
        );
    }

    /* Payout */
    function createPayout(uint256 _productId, uint256 _claimId, uint256 _amount)
        external
        onlyPolicyFlow("Policy")
        returns (uint256 _payoutId)
    {
        Claim storage claim = claims[_productId][_claimId];

        require(claim.createdAt > 0, "ERROR::CLAIM_NOT_EXISTS");

        _payoutId = ++payoutIdIncrement;

        Payout storage payout = payouts[_productId][_payoutId];
        payout.metadataId = claim.metadataId;
        payout.claimId = _claimId;
        payout.state = PayoutState.Expected;
        payout.expectedAmount = _amount;
        payout.createdAt = block.timestamp;
        payout.updatedAt = block.timestamp;

        Metadata storage meta = metadata[_productId][claim.metadataId];
        meta.payoutIds.push(_payoutId);
        meta.updatedAt = block.timestamp;

        emit LogNewPayout(
            _productId,
            _payoutId,
            claim.metadataId,
            meta.policyId,
            _claimId,
            _amount,
            PayoutState.Expected
        );
    }

    function payOut(uint256 _productId, uint256 _payoutId, uint256 _amount)
        external
        onlyPolicyFlow("Policy")
        returns (uint256 _remainder)
    {
        Payout storage payout = payouts[_productId][_payoutId];
        Metadata storage meta = metadata[_productId][payout.metadataId];

        require(payout.createdAt > 0, "ERROR::PAYOUT_NOT_EXISTS");

        uint256 actualAmount = payout.actualAmount.add(_amount);

        require(
            payout.state == PayoutState.Expected,
            "ERROR::PAYOUT_COMPLETED"
        );

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

            emit LogPayoutCompleted(
                _productId,
                meta.policyId,
                _payoutId,
                meta.policyId,
                actualAmount,
                payout.state
            );
        } else {
            // Partial
            payout.actualAmount = actualAmount;
            payout.updatedAt = block.timestamp;

            _remainder = payout.expectedAmount.sub(payout.actualAmount);

            emit LogPartialPayout(
                _productId,
                meta.policyId,
                _payoutId,
                payout.metadataId,
                actualAmount,
                _remainder,
                payout.state
            );
        }
    }

    function setPayoutState(
        uint256 _productId,
        uint256 _payoutId,
        PayoutState _state
    ) external onlyPolicyFlow("Policy") {
        Payout storage payout = payouts[_productId][_payoutId];

        require(payout.createdAt > 0, "ERROR::PAYOUT_NOT_EXISTS");

        payout.state = _state;
        payout.updatedAt = block.timestamp;

        Metadata storage meta = metadata[_productId][payout.metadataId];

        emit LogPayoutStateChanged(
            _productId,
            _payoutId,
            payout.metadataId,
            meta.policyId,
            payout.claimId,
            _state
        );
    }

    /* Views */
    function getApplicationData(uint256 _productId, uint256 _applicationId)
        external
        view
        returns (
        uint256 _metadataId,
        uint256 _premium,
        bytes32 _currency,
        ApplicationState _state
    )
    {
        _metadataId = applications[_productId][_applicationId].metadataId;
        _premium = applications[_productId][_applicationId].premium;
        _currency = applications[_productId][_applicationId].currency;
        _state = applications[_productId][_applicationId].state;
    }

    function getPayoutOptions(uint256 _productId, uint256 _applicationId)
        external
        view
        returns (uint256[] memory _payoutOptions)
    {
        _payoutOptions = applications[_productId][_applicationId].payoutOptions;
    }

    function getPremium(uint256 _productId, uint256 _applicationId)
        external
        view
        returns (uint256 _premium)
    {
        _premium = applications[_productId][_applicationId].premium;
    }

    function getApplicationState(uint256 _productId, uint256 _applicationId)
        external
        view
        returns (ApplicationState _state)
    {
        _state = applications[_productId][_applicationId].state;
    }

    function getPolicyState(uint256 _productId, uint256 _policyId)
        external
        view
        returns (PolicyState _state)
    {
        _state = policies[_productId][_policyId].state;
    }

    function getClaimState(uint256 _productId, uint256 _claimId)
        external
        view
        returns (ClaimState _state)
    {
        _state = claims[_productId][_claimId].state;
    }

    function getPayoutState(uint256 _productId, uint256 _payoutId)
        external
        view
        returns (PayoutState _state)
    {
        _state = payouts[_productId][_payoutId].state;
    }
}
