pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IStake.sol";

interface IStakeController {
    function createStakeFlow(uint256 _productId, bytes32 _bpKey) external;

    function setStakeFlowState(
        uint256 _metadataId,
        IStake.StakeFlowState _state
    ) external;

    function createApplication(bytes32 _bpKey, bytes calldata _data) external;

    function setApplicationState(
        bytes32 _bpKey,
        IStake.ApplicationState _state
    ) external;

    function createStake(bytes32 _bpKey) external;

    function setStakeState(bytes32 _bpKey, IStake.StakeState _state)
        external;

    function createClaim(bytes32 _bpKey, bytes calldata _data)
        external
        returns (uint256 _claimId);

    function setClaimState(
        bytes32 _bpKey,
        uint256 _claimId,
        IStake.ClaimState _state
    ) external;

    function createPayout(
        bytes32 _bpKey,
        uint256 _claimId,
        bytes calldata _data
    ) external returns (uint256 _payoutId);

    function payOut(
        bytes32 _bpKey,
        uint256 _payoutId,
        bool _complete,
        bytes calldata _data
    ) external;

    function setPayoutState(
        bytes32 _bpKey,
        uint256 _payoutId,
        IStake.PayoutState _state
    ) external;

    function getApplication(bytes32 _bpKey)
        external
        view
        returns (IStake.Application memory _application);

    function getStake(bytes32 _bpKey)
        external
        view
        returns (IStake.Stake memory _stake);

    function getClaim(bytes32 _bpKey, uint256 _claimId)
        external
        view
        returns (IStake.Claim memory _claim);

    function getPayout(bytes32 _bpKey, uint256 _payoutId)
        external
        view
        returns (IStake.Payout memory _payout);
}
