pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./PolicyStorageModel.sol";
import "../../shared/ModuleController.sol";

contract PolicyController is PolicyStorageModel, ModuleController {
    bytes32 public constant NAME = "PolicyController";

    constructor(address _registry) WithRegistry(_registry) {}

    /* Metadata */
    function createPolicyFlow(uint256 _productId, bytes32 _bpKey)
        external
        onlyPolicyFlow("Policy")
    {
        Metadata storage meta = metadata[_bpKey];
        require(
            meta.createdAt == 0,
            "ERROR:POC-001:METADATA_ALREADY_EXISTS_FOR_BPKEY"
        );

        meta.productId = _productId;
        meta.state = PolicyFlowState.Started;
        meta.createdAt = block.timestamp;
        meta.updatedAt = block.timestamp;
        bpKeys.push(_bpKey);

        emit LogNewMetadata(_productId, _bpKey, PolicyFlowState.Started);
    }

    function setPolicyFlowState(bytes32 _bpKey, PolicyFlowState _state)
        external
        onlyPolicyFlow("Policy")
    {
        Metadata storage meta = metadata[_bpKey];
        require(meta.createdAt > 0, "ERROR:POC-002:METADATA_DOES_NOT_EXIST");

        meta.state = _state;
        meta.updatedAt = block.timestamp;

        emit LogMetadataStateChanged(_bpKey, _state);
    }

    /* Application */
    function createApplication(bytes32 _bpKey, bytes calldata _options)
        public
        onlyPolicyFlow("Policy")
    {
        Metadata storage meta = metadata[_bpKey];
        require(meta.createdAt > 0, "ERROR:POC-004:METADATA_DOES_NOT_EXIST");

        Application storage application = applications[_bpKey];
        require(
            application.createdAt == 0,
            "ERROR:POC-003:APPLICATION_ALREADY_EXISTS"
        );

        application.state = ApplicationState.Applied;
        application.createdAt = block.timestamp;
        application.updatedAt = block.timestamp;

        assert(meta.createdAt > 0);
        assert(meta.hasApplication == false);

        meta.options = _options;
        meta.hasApplication = true;
        meta.updatedAt = block.timestamp;

        emit LogNewApplication(meta.productId, _bpKey);
    }

    function setApplicationState(bytes32 _bpKey, ApplicationState _state)
        external
        onlyPolicyFlow("Policy")
    {
        Application storage application = applications[_bpKey];
        require(
            application.createdAt > 0,
            "ERROR:POC-005:APPLICATION_DOES_NOT_EXIST"
        );

        application.state = _state;
        application.updatedAt = block.timestamp;

        emit LogApplicationStateChanged(_bpKey, _state);
    }

    /* Policy */
    function createPolicy(bytes32 _bpKey) external onlyPolicyFlow("Policy") {
        Metadata storage meta = metadata[_bpKey];
        require(meta.createdAt > 0, "ERROR:POC-007:METADATA_DOES_NOT_EXIST");
        require(
            meta.hasPolicy == false,
            "ERROR:POC-008:POLICY_ALREADY_EXISTS_FOR_BPKEY-2"
        );

        Policy storage policy = policies[_bpKey];
        require(
            policy.createdAt == 0,
            "ERROR:POC-006:POLICY_ALREADY_EXISTS_FOR_BPKEY"
        );

        policy.state = PolicyState.Active;
        policy.createdAt = block.timestamp;
        policy.updatedAt = block.timestamp;

        meta.hasPolicy = true;
        meta.updatedAt = block.timestamp;

        emit LogNewPolicy(_bpKey);
    }

    function setPolicyState(bytes32 _bpKey, PolicyState _state)
        external
        onlyPolicyFlow("Policy")
    {
        Policy storage policy = policies[_bpKey];
        require(policy.createdAt > 0, "ERROR:POC-009:POLICY_DOES_NOT_EXIST");

        policy.state = _state;
        policy.updatedAt = block.timestamp;

        emit LogPolicyStateChanged(_bpKey, _state);
    }

    /* Claim */
    function createClaim(bytes32 _bpKey, bytes calldata _data)
        external
        onlyPolicyFlow("Policy")
        returns (uint256 _claimId)
    {
        Metadata storage meta = metadata[_bpKey];
        require(meta.createdAt > 0, "ERROR:POC-011:METADATA_DOES_NOT_EXIST");

        Policy storage policy = policies[_bpKey];
        require(policy.createdAt > 0, "ERROR:POC-010:POLICY_DOES_NOT_EXIST");

        Claim storage claim = claims[_bpKey][_claimId];
        require(claim.createdAt == 0, "ERROR:POC-012:CLAIM_ALREADY_EXISTS");

        meta.claimsCount += 1;
        _claimId = meta.claimsCount;
        meta.updatedAt = block.timestamp;

        claim.state = ClaimState.Applied;
        claim.data = _data;
        claim.createdAt = block.timestamp;
        claim.updatedAt = block.timestamp;

        emit LogNewClaim(_bpKey, _claimId, ClaimState.Applied);
    }

    function setClaimState(
        bytes32 _bpKey,
        uint256 _claimId,
        ClaimState _state
    ) external onlyPolicyFlow("Policy") {
        Claim storage claim = claims[_bpKey][_claimId];
        require(claim.createdAt > 0, "ERROR:POC-012:CLAIM_DOES_NOT_EXIST");

        claim.state = _state;
        claim.updatedAt = block.timestamp;

        emit LogClaimStateChanged(_bpKey, _claimId, _state);
    }

    /* Payout */
    function createPayout(
        bytes32 _bpKey,
        uint256 _claimId,
        bytes calldata _data
    ) external onlyPolicyFlow("Policy") returns (uint256 _payoutId) {
        Metadata storage meta = metadata[_bpKey];
        require(meta.createdAt > 0, "ERROR:POC-013:METADATA_DOES_NOT_EXIST");

        Claim storage claim = claims[_bpKey][_claimId];
        require(claim.createdAt > 0, "ERROR:POC-014:CLAIM_DOES_NOT_EXIST");

        meta.payoutsCount += 1;
        _payoutId = meta.payoutsCount;
        meta.updatedAt = block.timestamp;

        Payout storage payout = payouts[_bpKey][_payoutId];
        require(payout.createdAt == 0, "ERROR:POC-015:PAYOUT_ALREADY_EXISTS");

        payout.claimId = _claimId;
        payout.data = _data;
        payout.state = PayoutState.Expected;
        payout.createdAt = block.timestamp;
        payout.updatedAt = block.timestamp;

        emit LogNewPayout(_bpKey, _claimId, _payoutId, PayoutState.Expected);
    }

    function payOut(
        bytes32 _bpKey,
        uint256 _payoutId,
        bool _complete,
        bytes calldata _data
    ) external onlyPolicyFlow("Policy") {
        Metadata storage meta = metadata[_bpKey];
        require(meta.createdAt > 0, "ERROR:POC-017:METADATA_DOES_NOT_EXIST");

        Payout storage payout = payouts[_bpKey][_payoutId];
        require(payout.createdAt > 0, "ERROR:POC-016:PAYOUT_DOES_NOT_EXIST");
        require(
            payout.state == PayoutState.Expected,
            "ERROR:POC-018:PAYOUT_ALREADY_COMPLETED"
        );

        payout.data = _data;
        payout.updatedAt = block.timestamp;

        if (_complete) {
            // Full
            payout.state = PayoutState.PaidOut;
            emit LogPayoutCompleted(_bpKey, _payoutId, payout.state);
        } else {
            // Partial
            emit LogPartialPayout(_bpKey, _payoutId, payout.state);
        }
    }

    function setPayoutState(
        bytes32 _bpKey,
        uint256 _payoutId,
        PayoutState _state
    ) external onlyPolicyFlow("Policy") {
        Payout storage payout = payouts[_bpKey][_payoutId];
        require(payout.createdAt > 0, "ERROR:POC-019:PAYOUT_DOES_NOT_EXIST");

        payout.state = _state;
        payout.updatedAt = block.timestamp;

        emit LogPayoutStateChanged(_bpKey, _payoutId, _state);
    }

    /*** GETTERS ****/

    function getApplicationState(bytes32 _bpKey)
        external
        view
        onlyPolicyFlow("Policy")
        returns (ApplicationState _state)
    {
        return applications[_bpKey].state;
    }

    function getPolicyState(bytes32 _bpKey)
        external
        view
        onlyPolicyFlow("Policy")
        returns (PolicyState _state)
    {
        return policies[_bpKey].state;
    }

    function getClaimState(bytes32 _bpKey, uint256 _claimId)
        external
        view
        onlyPolicyFlow("Policy")
        returns (ClaimState _state)
    {
        return claims[_bpKey][_claimId].state;
    }

    function getPayoutState(bytes32 _bpKey, uint256 _payoutId)
        external
        view
        onlyPolicyFlow("Policy")
        returns (PayoutState _state)
    {
        return payouts[_bpKey][_payoutId].state;
    }

    function getBpKeyCount() public returns (uint256 _count) {
        return bpKeys.length;
    }
}
