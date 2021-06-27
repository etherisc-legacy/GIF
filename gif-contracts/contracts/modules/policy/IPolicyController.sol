pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IPolicy.sol";

interface IPolicyController {
    function createPolicyFlow(uint256 _productId, bytes32 _bpKey) external;

    function setPolicyFlowState(
        uint256 _metadataId,
        IPolicy.PolicyFlowState _state
    ) external;

    function createApplication(bytes32 _bpKey, bytes calldata _options)
        external;

    function setApplicationState(
        bytes32 _bpKey,
        IPolicy.ApplicationState _state
    ) external;

    function createPolicy(bytes32 _bpKey) external returns (uint256 _policyId);

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
    ) external returns (uint256 _remainder);

    function setPayoutState(
        bytes32 _bpkey,
        uint256 _payoutId,
        IPolicy.PayoutState _state
    ) external;

    function getApplicationState(bytes32 _bpkey)
        external
        view
        returns (IPolicy.ApplicationState _state);

    function getPolicyState(bytes32 _bpkey)
        external
        view
        returns (IPolicy.PolicyState _state);

    function getClaimState(bytes32 _bpkey, uint256 _claimId)
        external
        view
        returns (IPolicy.ClaimState _state);

    function getPayoutState(bytes32 _bpkey, uint256 _payoutId)
        external
        view
        returns (IPolicy.PayoutState _state);
}
