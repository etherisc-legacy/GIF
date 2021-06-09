pragma solidity 0.8.0;
// SPDX-License-Identifier: Apache-2.0

interface IPolicy {
    // Events
    event LogNewMetadata(
        uint256 productId,
        bytes32 bpKey,
        PolicyFlowState state
    );

    event LogMetadataStateChanged(
        bytes32 bpKey,
        PolicyFlowState state
    );

    event LogNewApplication(
        uint256 productId,
        bytes32 bpkey
    );

    event LogApplicationStateChanged(
        bytes32 bpKey,
        ApplicationState state
    );

    event LogNewPolicy(
        bytes32 bpKey
    );

    event LogPolicyStateChanged(
        bytes32 bpKey,
        PolicyState state
    );

    event LogNewClaim(
        bytes32 bpKey,
        uint256 claimId,
        ClaimState state
    );

    event LogClaimStateChanged(
        bytes32 bpKey,
        uint256 claimId,
        ClaimState state
    );

    event LogNewPayout(
        bytes32 bpKey,
        uint256 claimId,
        uint256 payoutId,
        PayoutState state
    );

    event LogPayoutStateChanged(
        bytes32 bpKey,
        uint256 payoutId,
        PayoutState state
    );

    event LogPayoutCompleted(
        bytes32 bpKey,
        uint256 payoutId,
        PayoutState state
    );

    event LogPartialPayout(
        bytes32 bpKey,
        uint256 payoutId,
        PayoutState state
    );

    // Statuses
    enum PolicyFlowState {Started, Paused, Finished}

    enum ApplicationState {Applied, Revoked, Underwritten, Declined}

    enum PolicyState {Active, Expired}

    enum ClaimState {Applied, Confirmed, Declined}

    enum PayoutState {Expected, PaidOut}

    // Objects
    struct Metadata {
        // Lookup
        uint256 productId;
        bytes options; // ABI-encoded contract data: premium, currency, payout options etc.
        uint256 claimsCount;
        uint256 payoutsCount;
        bool hasPolicy;
        bool hasApplication;
        PolicyFlowState state;
        uint256 createdAt;
        uint256 updatedAt;

        address tokenContract;
        address registryContract;
        uint256 release;
    }

    struct Application {
        ApplicationState state;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Policy {
        PolicyState state;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Claim {
        // Data to prove claim, ABI-encoded
        bytes data;
        ClaimState state;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Payout {
        // Data describing the payout, ABI-encoded
        bytes data;
        uint256 claimId;
        PayoutState state;
        uint256 createdAt;
        uint256 updatedAt;
    }
}
