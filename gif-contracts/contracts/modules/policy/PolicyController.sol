pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./PolicyStorageModel.sol";
import "../../shared/ModuleController.sol";

contract PolicyController is PolicyStorageModel, ModuleController {

    constructor(address _registry) WithRegistry(_registry) {}

    /* Metadata */
    function createPolicyFlow(uint256 _productId, bytes32 _bpExternalKey)
        external
        onlyPolicyFlow("Policy")
        returns (uint256 _metadataId)
    {
        require(metadataIdByBpKey[_bpExternalKey] == 0, "ERROR::BP_KEY_NOT_UNIQUE");

        _metadataId = ++metadataIdIncrement;

        metadataIdByBpKey[_bpExternalKey] = _metadataId;

        Metadata storage meta = metadata[_metadataId];

        assert(meta.createdAt == 0);

        meta.productId = _productId;
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
        uint256 _metadataId,
        PolicyFlowState _state
    ) external onlyPolicyFlow("Policy") {
        Metadata storage meta = metadata[_metadataId];

        require(meta.createdAt > 0, "ERROR::METADATA_DOES_NOT_EXIST");

        meta.state = _state;
        meta.updatedAt = block.timestamp;

        emit LogMetadataStateChanged(_metadataId, _state);
    }

    /* Application */
    function createApplication(
        uint256 _metadataId,
        uint256 _premium,
        bytes32 _currency,
        uint256[] memory _payoutOptions
    ) public onlyPolicyFlow("Policy") returns (uint256 _applicationId) {
        applicationIdIncrement += 1;
        _applicationId = applicationIdIncrement;

        Application storage application = applications[_applicationId];

        assert(application.createdAt == 0);

        application.metadataId = _metadataId;
        application.premium = _premium;
        application.currency = _currency;
        // todo: check payoutOptions values
        application.payoutOptions = _payoutOptions;
        application.state = ApplicationState.Applied;
        application.createdAt = block.timestamp;
        application.updatedAt = block.timestamp;

        Metadata storage meta = metadata[_metadataId];

        assert(meta.createdAt > 0);
        assert(meta.applicationId == 0);
        assert(meta.hasApplication == false);

        meta.applicationId = _applicationId;
        meta.hasApplication = true;
        meta.updatedAt = block.timestamp;

        emit LogNewApplication(meta.productId, _metadataId, _applicationId);
    }

    function setApplicationState(
        uint256 _applicationId,
        ApplicationState _state
    ) external onlyPolicyFlow("Policy") {
        Application storage application = applications[_applicationId];

        require(application.createdAt > 0, "ERROR::APPLICATION_DOES_NOT_EXIST");

        application.state = _state;
        application.updatedAt = block.timestamp;

        emit LogApplicationStateChanged(
            application.metadataId,
            _applicationId,
            _state
        );
    }

    /* Policy */
    function createPolicy(uint256 _metadataId)
        external
        onlyPolicyFlow("Policy")
        returns (uint256 _policyId)
    {
        policyIdIncrement += 1;
        _policyId = policyIdIncrement;

        Policy storage policy = policies[_policyId];

        assert(policy.createdAt == 0);

        policy.metadataId = _metadataId;
        policy.state = PolicyState.Active;
        policy.createdAt = block.timestamp;
        policy.updatedAt = block.timestamp;

        Metadata storage meta = metadata[_metadataId];

        assert(meta.createdAt > 0);
        assert(meta.policyId == 0);
        assert(meta.hasPolicy == false);

        meta.policyId = _policyId;
        meta.hasPolicy = true;
        meta.updatedAt = block.timestamp;

        emit LogNewPolicy(
            meta.productId,
            _metadataId,
            _policyId,
            meta.applicationId
        );
    }

    function setPolicyState(
        uint256 _policyId,
        PolicyState _state
    ) external onlyPolicyFlow("Policy") {
        Policy storage policy = policies[_policyId];

        require(policy.createdAt > 0, "ERROR::POLICY_DOES_NOT_EXIST");

        policy.state = _state;
        policy.updatedAt = block.timestamp;

        emit LogPolicyStateChanged(
            policy.metadataId,
            _policyId,
            _state
        );
    }

    /* Claim */
    function createClaim(uint256 _policyId, bytes32 _data)
        external
        onlyPolicyFlow("Policy")
        returns (uint256 _claimId)
    {
        Policy storage policy = policies[_policyId];

        require(policy.createdAt > 0, "ERROR::POLICY_DOES_NOT_EXIST");

        claimIdIncrement += 1;
        _claimId = claimIdIncrement;

        Claim storage claim = claims[_claimId];

        assert(claim.createdAt == 0);

        claim.metadataId = policy.metadataId;
        claim.state = ClaimState.Applied;
        claim.data = _data;
        claim.createdAt = block.timestamp;
        claim.updatedAt = block.timestamp;

        Metadata storage meta = metadata[policy.metadataId];

        meta.claimIds.push(_claimId);
        meta.updatedAt = block.timestamp;

        emit LogNewClaim(
            meta.productId,
            policy.metadataId,
            _policyId,
            _claimId,
            ClaimState.Applied
        );
    }

    function setClaimState(
        uint256 _claimId,
        ClaimState _state
    ) external onlyPolicyFlow("Policy") {
        Claim storage claim = claims[_claimId];

        require(claim.createdAt > 0, "ERROR::CLAIM_DOES_NOT_EXIST");

        claim.state = _state;
        claim.updatedAt = block.timestamp;

        Metadata storage meta = metadata[claim.metadataId];

        emit LogClaimStateChanged(
            claim.metadataId,
            meta.policyId,
            _claimId,
            _state
        );
    }

    /* Payout */
    function createPayout(uint256 _claimId, uint256 _amount)
        external
        onlyPolicyFlow("Policy")
        returns (uint256 _payoutId)
    {
        Claim storage claim = claims[_claimId];

        require(claim.createdAt > 0, "ERROR::CLAIM_DOES_NOT_EXIST");

        payoutIdIncrement += 1;
        _payoutId = payoutIdIncrement;

        Payout storage payout = payouts[_payoutId];
        payout.metadataId = claim.metadataId;
        payout.claimId = _claimId;
        payout.state = PayoutState.Expected;
        payout.expectedAmount = _amount;
        payout.createdAt = block.timestamp;
        payout.updatedAt = block.timestamp;

        Metadata storage meta = metadata[claim.metadataId];
        meta.payoutIds.push(_payoutId);
        meta.updatedAt = block.timestamp;

        emit LogNewPayout(
            meta.productId,
            _payoutId,
            claim.metadataId,
            meta.policyId,
            _claimId,
            _amount,
            PayoutState.Expected
        );
    }

    function payOut(uint256 _payoutId, uint256 _amount)
        external
        onlyPolicyFlow("Policy")
        returns (uint256 _remainder)
    {
        Payout storage payout = payouts[_payoutId];
        Metadata storage meta = metadata[payout.metadataId];

        require(payout.createdAt > 0, "ERROR::PAYOUT_DOES_NOT_EXIST");

        uint256 actualAmount = payout.actualAmount + _amount;

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
                meta.productId,
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

            _remainder = payout.expectedAmount - payout.actualAmount;

            emit LogPartialPayout(
                meta.productId,
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
        uint256 _payoutId,
        PayoutState _state
    ) external onlyPolicyFlow("Policy") {
        Payout storage payout = payouts[_payoutId];

        require(payout.createdAt > 0, "ERROR::PAYOUT_DOES_NOT_EXIST");

        payout.state = _state;
        payout.updatedAt = block.timestamp;

        Metadata storage meta = metadata[payout.metadataId];

        emit LogPayoutStateChanged(
            _payoutId,
            payout.metadataId,
            meta.policyId,
            payout.claimId,
            _state
        );
    }

    /* Views */
    function getApplicationData(uint256 _applicationId)
        external
        view
        returns (
        uint256 _metadataId,
        uint256 _premium,
        bytes32 _currency,
        ApplicationState _state
    )
    {
        _metadataId = applications[_applicationId].metadataId;
        _premium = applications[_applicationId].premium;
        _currency = applications[_applicationId].currency;
        _state = applications[_applicationId].state;
    }

    function getPayoutOptions(uint256 _applicationId)
        external
        view
        returns (uint256[] memory _payoutOptions)
    {
        _payoutOptions = applications[_applicationId].payoutOptions;
    }

    function getPremium(uint256 _applicationId)
        external
        view
        returns (uint256 _premium)
    {
        _premium = applications[_applicationId].premium;
    }

    function getApplicationState(uint256 _applicationId)
        external
        view
        returns (ApplicationState _state)
    {
        _state = applications[_applicationId].state;
    }

    function getPolicyState(uint256 _policyId)
        external
        view
        returns (PolicyState _state)
    {
        _state = policies[_policyId].state;
    }

    function getClaimState(uint256 _claimId)
        external
        view
        returns (ClaimState _state)
    {
        _state = claims[_claimId].state;
    }

    function getPayoutState(uint256 _payoutId)
        external
        view
        returns (PayoutState _state)
    {
        _state = payouts[_payoutId].state;
    }

    function getMetadataByExternalKey(bytes32 _bpExternalKey)
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
        uint256 _metadataId = metadataIdByBpKey[_bpExternalKey];
        Metadata storage meta = metadata[_metadataId];

        productId = meta.productId;
        applicationId = meta.applicationId;
        policyId = meta.policyId;
        tokenContract = meta.tokenContract;
        registryContract = meta.registryContract;
        release = meta.release;
        createdAt = meta.createdAt;
        updatedAt = meta.updatedAt;
    }

    function getStateMessageByExternalKey(bytes32 _bpExternalKey)
        external view
        returns (bytes32 stateMessage)
    {
        uint256 _metadataId = metadataIdByBpKey[_bpExternalKey];
        stateMessage = metadata[_metadataId].stateMessage;
    }

    function getMetadata(uint256 _metadataId)
        external view
        returns(Metadata memory _meta)
    {
        return metadata[_metadataId];
    }

    function getApplication(uint256 _applicationId)
        external view
        returns(Application memory _application)
    {
        return applications[_applicationId];
    }


}
