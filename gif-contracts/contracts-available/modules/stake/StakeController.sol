pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./StakeStorageModel.sol";
import "../../shared/ModuleController.sol";

contract StakeController is StakeStorageModel, ModuleController {
    bytes32 public constant NAME = "StakeController";

    constructor(address _registry) WithRegistry(_registry) {}

    /* Metadata */
    function createStakeFlow(uint256 _productId, bytes32 _bpKey)
        external
        onlyStakeFlow("Stake")
    {
        Metadata storage meta = metadata[_bpKey];
        require(
            meta.createdAt == 0,
            "ERROR:POC-001:METADATA_ALREADY_EXISTS_FOR_BPKEY"
        );

        meta.productId = _productId;
        meta.state = StakeFlowState.Started;
        meta.createdAt = block.timestamp;
        meta.updatedAt = block.timestamp;
        bpKeys.push(_bpKey);

        emit LogNewMetadata(_productId, _bpKey, StakeFlowState.Started);
    }

    function setStakeFlowState(bytes32 _bpKey, StakeFlowState _state)
        external
        onlyStakeFlow("Stake")
    {
        Metadata storage meta = metadata[_bpKey];
        require(meta.createdAt > 0, "ERROR:POC-002:METADATA_DOES_NOT_EXIST");

        meta.state = _state;
        meta.updatedAt = block.timestamp;

        emit LogMetadataStateChanged(_bpKey, _state);
    }

    /* Application */
    function createApplication(bytes32 _bpKey, bytes calldata _data)
        external
        onlyStakeFlow("Stake")
    {
        Metadata storage meta = metadata[_bpKey];
        require(meta.createdAt > 0, "ERROR:POC-004:METADATA_DOES_NOT_EXIST");

        Application storage application = applications[_bpKey];
        require(
            application.createdAt == 0,
            "ERROR:POC-003:APPLICATION_ALREADY_EXISTS"
        );

        application.state = ApplicationState.Applied;
        application.data = _data;
        application.createdAt = block.timestamp;
        application.updatedAt = block.timestamp;

        assert(meta.createdAt > 0);
        assert(meta.hasApplication == false);

        meta.hasApplication = true;
        meta.updatedAt = block.timestamp;

        emit LogNewApplication(meta.productId, _bpKey);
    }

    function setApplicationState(bytes32 _bpKey, ApplicationState _state)
        external
        onlyStakeFlow("Stake")
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

    /* Stake */
    function createStake(bytes32 _bpKey) external {
        //}onlyStakeFlow("Stake") {

        Metadata storage meta = metadata[_bpKey];
        require(meta.createdAt > 0, "ERROR:POC-007:METADATA_DOES_NOT_EXIST");
        require(
            meta.hasStake == false,
            "ERROR:POC-008:STAKE_ALREADY_EXISTS_FOR_BPKEY"
        );

        Stake storage stake = policies[_bpKey];
        require(
            stake.createdAt == 0,
            "ERROR:POC-006:STAKE_ALREADY_EXISTS_FOR_BPKEY"
        );

        stake.state = StakeState.Active;
        stake.createdAt = block.timestamp;
        stake.updatedAt = block.timestamp;

        meta.hasStake = true;
        meta.updatedAt = block.timestamp;

        emit LogNewStake(_bpKey);
    }

    function setStakeState(bytes32 _bpKey, StakeState _state)
        external
        onlyStakeFlow("Stake")
    {
        Stake storage stake = policies[_bpKey];
        require(stake.createdAt > 0, "ERROR:POC-009:STAKE_DOES_NOT_EXIST");

        stake.state = _state;
        stake.updatedAt = block.timestamp;

        emit LogStakeStateChanged(_bpKey, _state);
    }

    /* Claim */
    function createClaim(bytes32 _bpKey, bytes calldata _data)
        external
        onlyStakeFlow("Stake")
        returns (uint256 _claimId)
    {
        Metadata storage meta = metadata[_bpKey];
        require(meta.createdAt > 0, "ERROR:POC-011:METADATA_DOES_NOT_EXIST");

        Stake storage stake = policies[_bpKey];
        require(stake.createdAt > 0, "ERROR:POC-010:STAKE_DOES_NOT_EXIST");

        _claimId = meta.claimsCount;
        Claim storage claim = claims[_bpKey][_claimId];
        require(claim.createdAt == 0, "ERROR:POC-012:CLAIM_ALREADY_EXISTS");

        meta.claimsCount += 1;
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
    ) external onlyStakeFlow("Stake") {
        Claim storage claim = claims[_bpKey][_claimId];
        require(claim.createdAt > 0, "ERROR:POC-013:CLAIM_DOES_NOT_EXIST");

        claim.state = _state;
        claim.updatedAt = block.timestamp;

        emit LogClaimStateChanged(_bpKey, _claimId, _state);
    }

    /* Payout */
    function createPayout(
        bytes32 _bpKey,
        uint256 _claimId,
        bytes calldata _data
    ) external onlyStakeFlow("Stake") returns (uint256 _payoutId) {
        Metadata storage meta = metadata[_bpKey];
        require(meta.createdAt > 0, "ERROR:POC-014:METADATA_DOES_NOT_EXIST");

        Claim storage claim = claims[_bpKey][_claimId];
        require(claim.createdAt > 0, "ERROR:POC-015:CLAIM_DOES_NOT_EXIST");

        _payoutId = meta.payoutsCount;
        Payout storage payout = payouts[_bpKey][_payoutId];
        require(payout.createdAt == 0, "ERROR:POC-016:PAYOUT_ALREADY_EXISTS");

        meta.payoutsCount += 1;
        meta.updatedAt = block.timestamp;

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
    ) external onlyStakeFlow("Stake") {
        Metadata storage meta = metadata[_bpKey];
        require(meta.createdAt > 0, "ERROR:POC-017:METADATA_DOES_NOT_EXIST");

        Payout storage payout = payouts[_bpKey][_payoutId];
        require(payout.createdAt > 0, "ERROR:POC-018:PAYOUT_DOES_NOT_EXIST");
        require(
            payout.state == PayoutState.Expected,
            "ERROR:POC-019:PAYOUT_ALREADY_COMPLETED"
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
    ) external onlyStakeFlow("Stake") {
        Payout storage payout = payouts[_bpKey][_payoutId];
        require(payout.createdAt > 0, "ERROR:POC-020:PAYOUT_DOES_NOT_EXIST");

        payout.state = _state;
        payout.updatedAt = block.timestamp;

        emit LogPayoutStateChanged(_bpKey, _payoutId, _state);
    }

    function getApplication(bytes32 _bpKey)
        external
        view
        returns (IStake.Application memory _application)
    {
        return applications[_bpKey];
    }

    function getStake(bytes32 _bpKey)
        external
        view
        returns (IStake.Stake memory _stake)
    {
        return policies[_bpKey];
    }

    function getClaim(bytes32 _bpKey, uint256 _claimId)
        external
        view
        returns (IStake.Claim memory _claim)
    {
        return claims[_bpKey][_claimId];
    }

    function getPayout(bytes32 _bpKey, uint256 _payoutId)
        external
        view
        returns (IStake.Payout memory _payout)
    {
        return payouts[_bpKey][_payoutId];
    }

    function getBpKeyCount() public view returns (uint256 _count) {
        return bpKeys.length;
    }
}
