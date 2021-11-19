pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IPolicy.sol";

interface IPolicyController {
    function createPolicyFlow(uint256 _productId, bytes32 _bpKey) external;

    function setPolicyFlowState(
        bytes32 _bpKey,
        IPolicy.PolicyFlowState _state
    ) external;

    function createApplication(bytes32 _bpKey, bytes calldata _data) external;

    function setApplicationState(
        bytes32 _bpKey,
        IPolicy.ApplicationState _state
    ) external;

    function createPolicy(bytes32 _bpKey) external;

    function setPolicyState(bytes32 _bpKey, IPolicy.PolicyState _state)
        external;

    function createClaim(bytes32 _bpKey, bytes calldata _data)
        external
        returns (uint256 _claimId);

    function setClaimState(
        bytes32 _bpKey,
        uint256 _claimId,
        IPolicy.ClaimState _state
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
        IPolicy.PayoutState _state
    ) external;

    function getApplication(bytes32 _bpKey)
        external
        view
        returns (IPolicy.Application memory _application);

    function getPolicy(bytes32 _bpKey)
        external
        view
        returns (IPolicy.Policy memory _policy);

    function getClaim(bytes32 _bpKey, uint256 _claimId)
        external
        view
        returns (IPolicy.Claim memory _claim);

    function getPayout(bytes32 _bpKey, uint256 _payoutId)
        external
        view
        returns (IPolicy.Payout memory _payout);

    function getBpKeyCount() external view returns (uint256 _count);
}
