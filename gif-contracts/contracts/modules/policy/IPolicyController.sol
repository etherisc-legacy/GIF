pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

import "./IPolicy.sol";

interface IPolicyController {
    function createPolicyFlow(
        uint256 _productId,
        bytes32 _bpKey
        )
        external
        returns (
            uint256 _metadataId
        );

    function setPolicyFlowState(
        uint256 _metadataId,
        IPolicy.PolicyFlowState _state
        )
        external;

    function createApplication(
        uint256 _metadataId,
        uint256 _premium,
        bytes32 _currency,
        uint256[] calldata _payoutOptions
        )
        external
        returns (
            uint256 _applicationId
        );

    function setApplicationState(
        uint256 _applicationId,
        IPolicy.ApplicationState _state
        )
        external;

    function createPolicy(
        uint256 _metadataId
        )
        external
        returns (
            uint256 _policyId
        );

    function setPolicyState(
        uint256 _policyId,
        IPolicy.PolicyState _state
        )
        external;

    function createClaim(
        uint256 _policyId,
        bytes32 _data
        )
        external
        returns (
            uint256 _claimId
        );

    function setClaimState(
        uint256 _claimId,
        IPolicy.ClaimState _state
        )
        external;

    function createPayout(
        uint256 _claimId,
        uint256 _amount
        )
        external
        returns (
            uint256 _payoutId
        );

    function payOut(
        uint256 _payoutId,
        uint256 _amount
        )
        external
        returns (
            uint256 _remainder
        );

    function setPayoutState(
        uint256 _payoutId,
        IPolicy.PayoutState _state
        )
        external;

    function getApplicationData(
        uint256 _applicationId
        )
        external
        view
        returns (
            uint256 _metadataId,
            uint256 _premium,
            bytes32 _currency,
            IPolicy.ApplicationState _state
        );

    function getPayoutOptions(
        uint256 _applicationId
        )
        external
        view
        returns (
            uint256[] memory _payoutOptions
        );

    function getPremium(
        uint256 _applicationId
        )
        external
        view
        returns (
            uint256 _premium
        );

    function getApplicationState(
        uint256 _applicationId
        )
        external
        view
        returns (
            IPolicy.ApplicationState _state
        );

    function getPolicyState(
        uint256 _policyId
        )
        external
        view
        returns (
            IPolicy.PolicyState _state
        );

    function getClaimState(
        uint256 _claimId
        )
        external
        view
        returns (
            IPolicy.ClaimState _state
        );

    function getPayoutState(
        uint256 _payoutId
        )
        external
        view
        returns (
            IPolicy.PayoutState _state
        );

    function getMetadataByExternalKey(
        bytes32 _bpKey
        )
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
        );

    function getStateMessageByExternalKey(
        bytes32 _bpKey
        )
        external
        view
        returns (
            bytes32 stateMessage
        );
}
